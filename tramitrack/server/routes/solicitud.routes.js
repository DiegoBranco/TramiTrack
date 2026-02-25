const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload-stub');
const controller = require('../controllers/solicitud.controller');

router.post('/', controller.create);
router.get('/mis', controller.getMySolicitudes);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id/estado', controller.updateEstado);
router.post('/:id/documento', upload.single('documentoFinal'), controller.uploadDocumentoFinal);

module.exports = router;