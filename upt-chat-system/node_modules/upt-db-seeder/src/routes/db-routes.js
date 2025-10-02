const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Importar seeders
const seedUsers = require('../seeders/seed-users');
const seedChatSessions = require('../seeders/seed-chat-sessions');
const seedKnowledgeBase = require('../seeders/seed-knowledge-base');

// Estado de la base de datos
router.get('/status', async (req, res) => {
  try {
    const dbStatus = {
      connected: mongoose.connection.readyState === 1,
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      collections: []
    };

    if (dbStatus.connected) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      dbStatus.collections = collections.map(col => col.name);
    }

    res.json(dbStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Estadísticas de la base de datos
router.get('/stats', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Base de datos no conectada' });
    }

    const User = require('../models/User');
    const ChatSession = require('../models/ChatSession');

    const stats = {
      timestamp: new Date().toISOString(),
      collections: {
        users: {
          total: await User.countDocuments(),
          byRole: {
            student: await User.countDocuments({ role: 'student' }),
            teacher: await User.countDocuments({ role: 'teacher' }),
            admin: await User.countDocuments({ role: 'admin' }),
            staff: await User.countDocuments({ role: 'staff' })
          }
        },
        chatSessions: {
          total: await ChatSession.countDocuments(),
          byStatus: {
            active: await ChatSession.countDocuments({ status: 'active' }),
            completed: await ChatSession.countDocuments({ status: 'completed' }),
            abandoned: await ChatSession.countDocuments({ status: 'abandoned' })
          }
        }
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ejecutar todos los seeders
router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Iniciando proceso de seeding completo...');
    
    const results = {
      timestamp: new Date().toISOString(),
      results: {}
    };

    // Seed usuarios
    console.log('👥 Poblando usuarios...');
    results.results.users = await seedUsers();
    
    // Seed sesiones de chat
    console.log('💬 Poblando sesiones de chat...');
    results.results.chatSessions = await seedChatSessions();
    
    // Seed base de conocimiento
    console.log('📚 Poblando base de conocimiento...');
    results.results.knowledgeBase = await seedKnowledgeBase();

    console.log('✅ Seeding completo exitoso');
    res.json({
      message: 'Base de datos poblada exitosamente',
      ...results
    });

  } catch (error) {
    console.error('❌ Error en seeding:', error);
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Seed solo usuarios
router.post('/seed/users', async (req, res) => {
  try {
    console.log('👥 Poblando solo usuarios...');
    const result = await seedUsers();
    res.json({
      message: 'Usuarios poblados exitosamente',
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed solo sesiones de chat
router.post('/seed/chat-sessions', async (req, res) => {
  try {
    console.log('💬 Poblando solo sesiones de chat...');
    const result = await seedChatSessions();
    res.json({
      message: 'Sesiones de chat pobladas exitosamente',
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Limpiar base de datos
router.post('/clear', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Base de datos no conectada' });
    }

    console.log('🧹 Limpiando base de datos...');
    
    const User = require('../models/User');
    const ChatSession = require('../models/ChatSession');

    const deletedUsers = await User.deleteMany({});
    const deletedSessions = await ChatSession.deleteMany({});

    console.log('✅ Base de datos limpia');
    
    res.json({
      message: 'Base de datos limpiada exitosamente',
      deleted: {
        users: deletedUsers.deletedCount,
        chatSessions: deletedSessions.deletedCount
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;