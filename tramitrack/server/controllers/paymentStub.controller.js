const path = require('path');
const PaymentStub = require('../models/paymentStub.model');

exports.uploadStub = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    try {
        const newStub = new PaymentStub({
            originalName: req.file.originalname,
            filename: req.file.filename,
            ruta_comprobante: req.file.path,
            solicitud_id: req.body.solicitud_id
        });
        await newStub.save();
        res.status(201).json({ message: 'Payment stub uploaded successfully', data: newStub });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error });
    }
};

exports.getStubsBySolicitud = async (req, res) => {
    try {
        const documents = await PaymentStub.find({ solicitud_id: req.params.solicitud_id });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching documents', error });
    }
};

exports.downloadStub = async (req, res) => {
    try {
        const document = await PaymentStub.findById(req.params.id);
        if (!document) return res.status(404).json({ message: 'Document not found' });
        const filePath = path.join(__dirname, '../uploads', document.filename);
        res.download(filePath, document.originalName);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching document', error });
    }
};