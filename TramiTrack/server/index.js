const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express Server!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
