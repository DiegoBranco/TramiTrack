const TramiteType = require('../models/tramiteType.model');

exports.getAll = async (req, res) => {
    try {
        const tipos = await TramiteType.find();
        res.json(tipos);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo tipos de trámite', error });
    }
};

exports.getById = async (req, res) => {
    try {
        const tipo = await TramiteType.findById(req.params.id);
        if (!tipo) return res.status(404).json({ message: 'Tipo de trámite no encontrado' });
        res.json(tipo);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo tipo de trámite', error });
    }
};

exports.create = async (req, res) => {
    try {
        const tipo = new TramiteType(req.body);
        await tipo.save();
        res.status(201).json(tipo);
    } catch (error) {
        res.status(500).json({ message: 'Error creando tipo de trámite', error });
    }
};

exports.update = async (req, res) => {
    try {
        const tipo = await TramiteType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tipo) return res.status(404).json({ message: 'Tipo de trámite no encontrado' });
        res.json(tipo);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando tipo de trámite', error });
    }
};

exports.delete = async (req, res) => {
    try {
        const tipo = await TramiteType.findByIdAndDelete(req.params.id);
        if (!tipo) return res.status(404).json({ message: 'Tipo de trámite no encontrado' });
        res.json({ message: 'Tipo de trámite eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando tipo de trámite', error });
    }
};