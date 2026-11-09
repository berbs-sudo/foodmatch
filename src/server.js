import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import apiRoutes from './routes/routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Logging de requisições no desenvolvimento
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rotas da API REST
app.use('/api', apiRoutes);

// Endpoint de Saúde
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    app: 'FoodMatch (Tinder + iFood)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Se a build do frontend existir, serve arquivos estáticos
const clientBuildPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Inicialização do servidor HTTP
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 FoodMatch API Server rodando na porta ${PORT}`);
  console.log(`📡 URL Base: http://localhost:${PORT}`);
  console.log(`🩺 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

export default app;
