import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Routes API
app.use('/api', apiRoutes);

// Route pour servir l'application React
app.get('*', (req, res) => {
  res.sendFile(process.cwd() + '/dist/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
