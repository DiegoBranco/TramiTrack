const mongoose = require('mongoose');

const PaymentStub = mongoose.model('PaymentStub', new mongoose.Schema({
    originalName: String,
    filename: String,
    ruta_comprobante: String,
    solicitud_id: String,
    uploadDate: { type: Date, default: Date.now }
}));

module.exports = PaymentStub;