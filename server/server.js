import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './api.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Après avoir importé express
app.use(helmet());

// Limite de taux pour les requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par fenêtre
});
app.use(limiter);

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
