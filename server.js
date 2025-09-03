const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Rotas
const userRoutes = require('./routes/userRoutes');
const sensorRoutes = require('./routes/sensorRoutes');

app.use('/api/users', userRoutes);
app.use('/api/sensors', sensorRoutes);

// Conectar MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro ao conectar:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
