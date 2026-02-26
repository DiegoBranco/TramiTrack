const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const seedDatabase = require("./seeds/index"); //data de ejemplo para pruebas

const app = express();
const port = process.env.SERVER_PORT || 3001;

// Import routes
const tramiteTypeRoutes = require("./routes/tramiteType.routes");
const solicitudRoutes = require("./routes/solicitud.routes");
const paymentStubRoutes = require("./routes/paymentStub.routes");
const userRoutes = require("./routes/user.routes");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use routes
app.use("/api/tramite-types", tramiteTypeRoutes);
app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/payment-stubs", paymentStubRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.json({ message: "Hello from Express Server!" }));

const startServer = async () => {
  try {
    await connectDB();
    console.log("Conexión a base de datos exitosa");

    await seedDatabase();

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
