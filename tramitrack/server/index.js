const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.SERVER_PORT || 3001;
const mongoUri = process.env.MONGO_URI 

console.log(`Attempting to connect to MongoDB at: ${mongoUri}`);

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with the original extension
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Mongoose Model for Payment Stub
const PaymentStub = mongoose.model('PaymentStub', new mongoose.Schema({
  originalName: String,
  filename: String,
  path: String,
  uploadDate: { type: Date, default: Date.now }
}));

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express Server!' });
});

app.post('/upload-stub', upload.single('paymentStub'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const newStub = new PaymentStub({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path
    });
    await newStub.save();
    res.status(201).json({ message: 'Payment stub uploaded successfully', data: newStub });
  } catch (error) {
    console.error('Error saving payment stub:', error);
    res.status(500).json({ message: 'Error uploading file', error });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
