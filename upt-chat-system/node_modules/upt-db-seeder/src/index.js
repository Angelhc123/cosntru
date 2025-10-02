const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Importar rutas
const dbRoutes = require('./routes/db-routes');
const healthRoutes = require('./routes/health-routes');

// Usar rutas
app.use('/health', healthRoutes);
app.use('/db', dbRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    service: 'UPT DB Seeder',
    version: '1.0.0',
    status: 'active',
    description: 'Servicio para inicializar y poblar la base de datos MongoDB',
    endpoints: {
      health: '/health',
      dbStatus: '/db/status',
      seed: '/db/seed',
      clear: '/db/clear',
      stats: '/db/stats'
    }
  });
});

// Conexión a MongoDB
const connectDB = async () => {
  try {
    // Credenciales directas para que funcione YA
    const mongoURI = 'mongodb+srv://pp2020067576:dKJThbxyBE2CG9bg@basededatos2.h1ccthn.mongodb.net/upt_chat_system?retryWrites=true&w=majority&appName=BASEDEDATOS2';
    
    await mongoose.connect(mongoURI);

    console.log('✅ Conectado a MongoDB exitosamente');
    console.log(`📍 Base de datos: ${mongoose.connection.name}`);
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Manejo de errores de conexión
mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB desconectado');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Cerrando conexión a MongoDB...');
  await mongoose.connection.close();
  console.log('✅ Conexión cerrada exitosamente');
  process.exit(0);
});

// Iniciar servidor
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 DB Seeder Service ejecutándose en puerto ${PORT}`);
    console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Panel de control: http://localhost:${PORT}`);
  });
};

startServer().catch(console.error);

module.exports = app;