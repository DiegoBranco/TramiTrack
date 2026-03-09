const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false },
);

const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CEDULA_RUT_REGEX = /^(?:\d{6,12}|\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK])$/;

const datosFormularioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, maxlength: 80, trim: true },
    apellido: { type: String, required: true, maxlength: 80, trim: true },
    cedula: {
      type: String,
      required: true,
      maxlength: 20,
      trim: true,
      validate: {
        validator: (value) => CEDULA_RUT_REGEX.test(value),
        message: "Formato de cédula inválido",
      },
    },
    correo: {
      type: String,
      required: true,
      maxlength: 254,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => EMAIL_REGEX.test(value),
        message: "Formato de correo inválido",
      },
    },
    cuenta_bancaria: { type: String, maxlength: 34, trim: true },
    referencia_pago: { type: String, maxlength: 100, trim: true },
    monto: { type: Number, min: 0 },
    fecha_pago: { type: Date },
  },
  { _id: false, strict: true },
);

const solicitudSchema = new mongoose.Schema(
  {
    numero_seguimiento: { type: String, unique: true },
    estudiante_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tramiteType_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TramiteType",
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "en_proceso", "completado", "rechazado", "entregado"],
      default: "pendiente",
    },
    observaciones: { type: String },
    fecha_solicitud: { type: Date, default: Date.now },
    fecha_estimada: { type: Date },
    datos_formulario: { type: datosFormularioSchema, required: true },
    comprobante_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentStub",
    },
    constancia_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constancia",
    },
    documento_final: { type: String },
  },
  { timestamps: true },
);

// Genera el número de seguimiento antes de guardar
solicitudSchema.pre("save", async function () {
  if (!this.numero_seguimiento) {
    const lastSolicitud = await mongoose
      .model("Solicitud")
      .findOne({ numero_seguimiento: /^TRM-\d+$/ })
      .sort({ numero_seguimiento: -1 })
      .select("numero_seguimiento")
      .lean();

    const maxSeq = lastSolicitud
      ? Number((lastSolicitud.numero_seguimiento || "").replace("TRM-", "")) || 0
      : 0;

    await Counter.findByIdAndUpdate(
      "solicitud",
      { $max: { seq: maxSeq } },
      { upsert: true, setDefaultsOnInsert: true },
    );

    const counter = await Counter.findByIdAndUpdate(
      "solicitud",
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    this.numero_seguimiento = `TRM-${String(counter.seq).padStart(6, "0")}`;
  }
});

module.exports = mongoose.model("Solicitud", solicitudSchema);
