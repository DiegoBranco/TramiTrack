const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    cedula: { type: Number, required: true, unique: true },
    password: { type: String, required: true }, // Texto plano para pruebas
    rol: {
      type: String,
      enum: ["estudiante", "admin"],
      default: "estudiante",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
