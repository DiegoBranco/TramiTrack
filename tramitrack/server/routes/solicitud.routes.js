const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload-stub");
const controller = require("../controllers/solicitud.controller");

// handle file upload coming from form (comprobante)
router.post("/", upload.single("comprobante"), controller.create);
router.get("/mis", controller.getMySolicitudes);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.patch("/:id/estado", controller.updateEstado);
router.post(
  "/:id/documento",
  upload.single("documentoFinal"),
  controller.uploadDocumentoFinal,
);

module.exports = router;
