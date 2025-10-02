const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Health check básico
router.get('/', (req, res) => {
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'UPT DB Seeder',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };

  res.json(healthStatus);
});

// Health check detallado
router.get('/detailed', async (req, res) => {
  try {
    // Verificar conexión a MongoDB
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Información del sistema
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      }
    };

    // Verificar colecciones principales
    let collections = {};
    if (dbStatus === 'connected') {
      try {
        const User = require('../models/User');
        const ChatSession = require('../models/ChatSession');
        
        collections = {
          users: await User.countDocuments(),
          chatSessions: await ChatSession.countDocuments()
        };
      } catch (error) {
        collections = { error: 'No se pudieron contar documentos' };
      }
    }

    const detailedHealth = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())} segundos`,
      database: {
        status: dbStatus,
        name: mongoose.connection.name || 'N/A',
        host: mongoose.connection.host || 'N/A'
      },
      collections,
      system: systemInfo
    };

    res.json(detailedHealth);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;