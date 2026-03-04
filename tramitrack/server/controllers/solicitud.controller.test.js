const SolicitudController = require('./solicitud.controller');
const Solicitud = require('../models/solicitud.model');

// Mock the Solicitud model
jest.mock('../models/solicitud.model');

describe('SolicitudController.updateEstado', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: 'solicitud123' },
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    it('should return 404 if solicitud is not found initially', async () => {
        Solicitud.findById.mockResolvedValue(null);

        await SolicitudController.updateEstado(req, res);

        expect(Solicitud.findById).toHaveBeenCalledWith('solicitud123');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Solicitud no encontrada" });
    });

    it('should return 400 if the provided estado is not a valid enum value', async () => {
        Solicitud.findById.mockResolvedValue({ estado: 'pendiente' });
        req.body.estado = 'estado_invalido';

        await SolicitudController.updateEstado(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Estado inválido" });
    });

    it('should return 400 if trying to transition from "pendiente" to anything other than "en_proceso"', async () => {
        Solicitud.findById.mockResolvedValue({ estado: 'pendiente' });
        req.body.estado = 'completado'; // Invalid transition

        await SolicitudController.updateEstado(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Solo se puede pasar de pendiente a en_proceso" });
    });

    it('should successfully update state from "pendiente" to "en_proceso"', async () => {
        const mockSolicitud = { estado: 'pendiente' };
        Solicitud.findById.mockResolvedValue(mockSolicitud);
        
        req.body.estado = 'en_proceso';
        req.body.observaciones = 'Documentos recibidos';

        const updatedSolicitud = { ...mockSolicitud, estado: 'en_proceso', observaciones: 'Documentos recibidos' };
        Solicitud.findByIdAndUpdate.mockResolvedValue(updatedSolicitud);

        await SolicitudController.updateEstado(req, res);

        expect(Solicitud.findByIdAndUpdate).toHaveBeenCalledWith(
            'solicitud123',
            { estado: 'en_proceso', observaciones: 'Documentos recibidos' },
            { new: true }
        );
        expect(res.json).toHaveBeenCalledWith(updatedSolicitud);
    });

    it('should return 400 if trying to transition from "en_proceso" to an invalid state', async () => {
        Solicitud.findById.mockResolvedValue({ estado: 'en_proceso' });
        req.body.estado = 'pendiente'; // Invalid transition

        await SolicitudController.updateEstado(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Solo se puede pasar de en_proceso a completado o rechazado" });
    });

    it('should successfully update state from "en_proceso" to "completado"', async () => {
        const mockSolicitud = { estado: 'en_proceso' };
        Solicitud.findById.mockResolvedValue(mockSolicitud);
        req.body.estado = 'completado';

        const updatedSolicitud = { ...mockSolicitud, estado: 'completado' };
        Solicitud.findByIdAndUpdate.mockResolvedValue(updatedSolicitud);

        await SolicitudController.updateEstado(req, res);

        expect(res.json).toHaveBeenCalledWith(updatedSolicitud);
    });

    it('should successfully update state from "en_proceso" to "rechazado"', async () => {
        const mockSolicitud = { estado: 'en_proceso' };
        Solicitud.findById.mockResolvedValue(mockSolicitud);
        req.body.estado = 'rechazado';

        const updatedSolicitud = { ...mockSolicitud, estado: 'rechazado' };
        Solicitud.findByIdAndUpdate.mockResolvedValue(updatedSolicitud);

        await SolicitudController.updateEstado(req, res);

        expect(res.json).toHaveBeenCalledWith(updatedSolicitud);
    });

    it('should return 400 if trying to update from a terminal state (e.g., completado)', async () => {
        Solicitud.findById.mockResolvedValue({ estado: 'completado' });
        req.body.estado = 'en_proceso';

        await SolicitudController.updateEstado(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining("No se puede cambiar el estado desde completado")
        }));
    });

    it('should handle database errors gracefully', async () => {
        const errorMessage = 'Database connection failed';
        Solicitud.findById.mockRejectedValue(new Error(errorMessage));

        await SolicitudController.updateEstado(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 
            message: "Error actualizando estado", 
            error: expect.any(Error) 
        });
    });
});