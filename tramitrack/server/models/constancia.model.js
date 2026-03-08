const mongoose = require("mongoose");

const Constancia = mongoose.model(
  "Constancia",
  new mongoose.Schema({
    originalName: String,
    filename: String,
    ruta_constancia: String,
    solicitud_id: String,
    uploadDate: { type: Date, default: Date.now },
  }),
);

module.exports = Constancia;
