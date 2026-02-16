const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.SERVER_PORT || 3001;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/tramitrack';

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express Server!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
