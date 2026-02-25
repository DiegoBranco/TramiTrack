const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
//const paymentStubRoutes = require('./routes/paymentStub.routes');

const app = express();
const port = process.env.SERVER_PORT || 3001;

// Import routes
const tramiteTypeRoutes = require("./routes/tramiteType.routes");
const solicitudRoutes = require("./routes/solicitud.routes");
const paymentStubRoutes = require("./routes/paymentStub.routes");
const userRoutes = require("./routes/user.routes");

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//app.use('/', paymentStubRoutes);

app.get("/", (req, res) => res.json({ message: "Hello from Express Server!" }));

// Use routes
app.use("/api/tramite-types", tramiteTypeRoutes);
app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/payment-stubs", paymentStubRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`),
);
