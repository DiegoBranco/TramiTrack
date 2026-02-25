const Solicitud = require('../models/solicitud.model');
const TramiteType = require('../models/tramiteType.model');

// Estudiante crea una solicitud
exports.create = async (req, res) => {
    try {
        const { tramiteType_id, datos_formulario } = req.body;

        const tipo = await TramiteType.findById(tramiteType_id);
        if (!tipo) return res.status(404).json({ message: 'Tipo de trámite no encontrado' });

        // Calcular fecha estimada sumando días hábiles
        const fecha_estimada = new Date();
        fecha_estimada.setDate(fecha_estimada.getDate() + tipo.dias_habiles);

        const solicitud = new Solicitud({
            estudiante_id: req.body.estudiante_id, // luego vendrá del JWT
            tramiteType_id,
            datos_formulario,
            fecha_estimada
        });

        await solicitud.save();
        res.status(201).json(solicitud);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando solicitud', error: error.message });
    }
};

// Estudiante ve sus propias solicitudes
exports.getMySolicitudes = async (req, res) => {
    try {
        const { estudiante_id } = req.query; // luego vendrá del JWT
        const solicitudes = await Solicitud.find({ estudiante_id })
            .populate('tramiteType_id', 'nombre costo dias_habiles')
            .sort({ createdAt: -1 });
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo solicitudes', error });
    }
};

// Estudiante y admin ven el detalle de una solicitud
exports.getById = async (req, res) => {
    try {
        const solicitud = await Solicitud.findById(req.params.id)
            .populate('tramiteType_id')
            .populate('comprobante_id');
        if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
        res.json(solicitud);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo solicitud', error });
    }
};

// Admin ve todas las solicitudes con filtros opcionales
exports.getAll = async (req, res) => {
    try {
        const { estado, tramiteType_id } = req.query;
        const filtros = {};
        if (estado) filtros.estado = estado;
        if (tramiteType_id) filtros.tramiteType_id = tramiteType_id;

        const solicitudes = await Solicitud.find(filtros)
            .populate('tramiteType_id', 'nombre')
            .populate('estudiante_id', 'nombre apellido')
            .sort({ createdAt: -1 });
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo solicitudes', error });
    }
};

// Admin cambia estado + observaciones
exports.updateEstado = async (req, res) => {
    try {
        const { estado, observaciones } = req.body;
        const solicitud = await Solicitud.findByIdAndUpdate(
            req.params.id,
            { estado, observaciones },
            { new: true }
        );
        if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
        res.json(solicitud);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando estado', error });
    }
};

// Admin sube el PDF final del trámite completado
exports.uploadDocumentoFinal = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No se subió ningún archivo' });
        const solicitud = await Solicitud.findByIdAndUpdate(
            req.params.id,
            { documento_final: req.file.path, estado: 'completado' },
            { new: true }
        );
        if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
        res.json(solicitud);
    } catch (error) {
        res.status(500).json({ message: 'Error subiendo documento final', error });
    }
};