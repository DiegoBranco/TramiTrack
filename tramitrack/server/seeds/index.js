const User = require("../models/user.model");
const TramiteType = require("../models/tramiteType.model");
const Solicitud = require("../models/solicitud.model");

const seedDatabase = async () => {
  try {
    console.log("🌱 Revisando datos iniciales...");

    // --- SEED DE USUARIOS ---
    const users = [
      {
        nombre: "Maximiliano",
        apellido: "Carrillo",
        cedula: "29123456",
        correo: "maximilianoc@gmail.com",
        password: "123",
        rol: "estudiante",
      },
      {
        nombre: "Oscary",
        apellido: "Arocha",
        cedula: "30456789",
        correo: "oscary.arocha@gmail.com",
        password: "123",
        rol: "estudiante",
      },
      {
        nombre: "Daniela",
        apellido: "Carrero",
        cedula: "25789012",
        correo: "daniela.admin@tramitrack.com",
        password: "admin",
        rol: "admin",
      },
      {
        nombre: "Admin",
        apellido: "General",
        cedula: "10111222",
        correo: "admin@tramitrack.com",
        password: "admin",
        rol: "admin",
      },
    ];

    for (const u of users) {
      // Validamos que no exista ni el correo ni la cédula
      const exists = await User.findOne({
        $or: [{ correo: u.correo }, { cedula: u.cedula }],
      });

      if (!exists) {
        await User.create(u);
        console.log(`Usuario creado: ${u.nombre} ${u.apellido} (${u.rol})`);
      } else {
        console.log(`El usuario ${u.nombre} (o su correo/cédula) ya existe.`);
      }
    }

    // --- SEED DE TIPOS DE TRÁMITE ---
    const tramites = [
      {
        nombre: "Constancia de Estudios",
        descripcion: "Documento oficial que certifica las materias cursadas",
        costo: 10,
        dias_habiles: 3,
      },
      {
        nombre: "Constancia de Inscripción",
        descripcion:
          "Documento que certifica tu inscripción actual en la institución",
        costo: 10,
        dias_habiles: 3,
      },
      //{
      //nombre: "Constancia de Notas",
      //descripcion:
      //"Documento oficial que certifica las materias cursadas y calificaciones",
      //costo: 15,
      // dias_habiles: 10,
      //},
    ];

    for (const t of tramites) {
      const exists = await TramiteType.findOne({ nombre: t.nombre });
      if (!exists) {
        await TramiteType.create(t);
        console.log(`Trámite creado: ${t.nombre}`);
      }
    }

    // --- SEED DE SOLICITUD DE PRUEBA ---
    // Crear una solicitud de "Constancia de Estudios" usando un estudiante existente
    const tramiteConstancia = await TramiteType.findOne({ nombre: "Constancia de Estudios" });
    const estudiante = await User.findOne({ correo: "maximilianoc@gmail.com" }) || await User.findOne({ correo: "oscary.arocha@gmail.com" });

    if (tramiteConstancia && estudiante) {
      // Evitar duplicados: buscar una solicitud reciente del mismo estudiante y tipo
      const existeSol = await Solicitud.findOne({ estudiante_id: estudiante._id, tramiteType_id: tramiteConstancia._id });
      if (!existeSol) {
        const nueva = {
          estudiante_id: estudiante._id,
          tramiteType_id: tramiteConstancia._id,
          estado: 'pendiente',
          observaciones: 'Solicitud de prueba generada por seed',
          datos_formulario: {
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            cedula: estudiante.cedula,
            correo: estudiante.correo,
            cuenta_bancaria: '11111111111111111111',
            referencia_pago: 'SEED-REF-0001',
            monto: tramiteConstancia.costo || 10,
            fecha_pago: new Date(),
          },
        };

        await Solicitud.create(nueva);
        console.log('Solicitud de prueba creada para', estudiante.correo);
      } else {
        console.log('Ya existe una solicitud para ese estudiante y trámite; no se creó duplicado.');
      }
    } else {
      console.log('No se encontró usuario o tipo de trámite para crear la solicitud de seed.');
    }

    console.log("Proceso de seeding completado.");
  } catch (error) {
    console.error("Error en el seeding:", error);
  }
};

module.exports = seedDatabase;
