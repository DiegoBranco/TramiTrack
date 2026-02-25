const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload-stub');
const controller = require('../controllers/paymentStub.controller');

router.post('/upload-stub', upload.single('paymentStub'), controller.uploadStub);
router.get('/solicitudStubs/:solicitud_id', controller.getStubsBySolicitud);
router.get('/stubFile/:id', controller.downloadStub);

module.exports = router;