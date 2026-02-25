const mongoose = require('mongoose');

const tramiteTypeSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    requisitos: { type: String },
    costo: { type: Number, required: true },
    dias_habiles: { type: Number, required: true },
    icono: { type: String }
});

module.exports = mongoose.model('TramiteType', tramiteTypeSchema);