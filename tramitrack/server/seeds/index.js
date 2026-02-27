const User = require("../models/user.model");
const TramiteType = require("../models/tramiteType.model");

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

    console.log("Proceso de seeding completado.");
  } catch (error) {
    console.error("Error en el seeding:", error);
  }
};

module.exports = seedDatabase;
