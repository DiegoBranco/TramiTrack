const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const paymentStubRoutes = require('./routes/paymentStub.routes');

const app = express();
const port = process.env.SERVER_PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', paymentStubRoutes);

app.get('/', (req, res) => res.json({ message: 'Hello from Express Server!' }));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));