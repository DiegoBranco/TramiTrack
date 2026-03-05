const mongoose = require("mongoose");
const Solicitud = require("../../server/models/solicitud.model");

const buildValidSolicitud = () => ({
  estudiante_id: new mongoose.Types.ObjectId(),
  tramiteType_id: new mongoose.Types.ObjectId(),
  datos_formulario: {
    nombre: "Ana",
    apellido: "Pérez",
    cedula: "29123456",
    correo: "ana.perez@correo.com",
  },
});

describe("Validación modelo Solicitud", () => {
  test("IC1: todos los campos obligatorios válidos", () => {
    const solicitud = new Solicitud(buildValidSolicitud());

    const error = solicitud.validateSync();

    expect(error).toBeUndefined();
  });

  test("IC2: falta un campo requerido", () => {
    const payload = buildValidSolicitud();
    delete payload.datos_formulario.nombre;
    const solicitud = new Solicitud(payload);

    const error = solicitud.validateSync();

    expect(error).toBeDefined();
    expect(error.errors["datos_formulario.nombre"]).toBeDefined();
    expect(error.errors["datos_formulario.nombre"].kind).toBe("required");
  });

  test("IC3: campo con tipo errado", () => {
    const payload = buildValidSolicitud();
    payload.datos_formulario.monto = "texto-no-numerico";
    const solicitud = new Solicitud(payload);

    const error = solicitud.validateSync();

    expect(error).toBeDefined();
    expect(error.errors["datos_formulario.monto"]).toBeDefined();
    expect(error.errors["datos_formulario.monto"].name).toBe("CastError");
  });

  test("IC4: campo demasiado largo", () => {
    const payload = buildValidSolicitud();
    payload.datos_formulario.nombre = "A".repeat(81);
    const solicitud = new Solicitud(payload);

    const error = solicitud.validateSync();

    expect(error).toBeDefined();
    expect(error.errors["datos_formulario.nombre"]).toBeDefined();
    expect(error.errors["datos_formulario.nombre"].kind).toBe("maxlength");
  });

  test("IC5: formato de email inválido", () => {
    const payload = buildValidSolicitud();
    payload.datos_formulario.correo = "correo-invalido";
    const solicitud = new Solicitud(payload);

    const error = solicitud.validateSync();

    expect(error).toBeDefined();
    expect(error.errors["datos_formulario.correo"]).toBeDefined();
    expect(error.errors["datos_formulario.correo"].kind).toBe("user defined");
  });

  test("IC6: formato de cédula inválido", () => {
    const payload = buildValidSolicitud();
    payload.datos_formulario.cedula = "ABC-12";
    const solicitud = new Solicitud(payload);

    const error = solicitud.validateSync();

    expect(error).toBeDefined();
    expect(error.errors["datos_formulario.cedula"]).toBeDefined();
    expect(error.errors["datos_formulario.cedula"].kind).toBe("user defined");
  });

  test("IC7: esquema JSON inválido (datos_formulario no es objeto)", () => {
    const payload = buildValidSolicitud();
    payload.datos_formulario = "no-es-json";
    const solicitud = new Solicitud(payload);

    const error = solicitud.validateSync();

    expect(error).toBeDefined();
    expect(error.errors["datos_formulario"]).toBeDefined();
    expect(error.errors["datos_formulario"].name).toBe("CastError");
  });

  test("ID1: campos opcionales ausentes", () => {
    const solicitud = new Solicitud(buildValidSolicitud());

    const error = solicitud.validateSync();

    expect(error).toBeUndefined();
  });

  test("ID2: campos opcionales presentes", () => {
    const payload = buildValidSolicitud();
    payload.datos_formulario.cuenta_bancaria = "0134-0001-000000123456";
    payload.datos_formulario.referencia_pago = "REF-2026-0001";
    payload.datos_formulario.monto = 25.5;
    payload.datos_formulario.fecha_pago = new Date("2026-03-04");

    const solicitud = new Solicitud(payload);
    const error = solicitud.validateSync();

    expect(error).toBeUndefined();
  });
});
