const mongoose = require("mongoose");

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
    datos_formulario: {
      nombre: String,
      apellido: String,
      cedula: String,
      correo: String,
      cuenta_bancaria: String,
      referencia_pago: String,
      monto: Number,
      fecha_pago: Date,
    },
    comprobante_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentStub",
    },
    documento_final: { type: String },
  },
  { timestamps: true },
);

// Genera el número de seguimiento antes de guardar
solicitudSchema.pre("save", async function () {
  if (!this.numero_seguimiento) {
    const count = await mongoose.model("Solicitud").countDocuments();
    this.numero_seguimiento = `TRM-${String(count + 1).padStart(6, "0")}`;
  }
});

module.exports = mongoose.model("Solicitud", solicitudSchema);
