// ===============================================
// INICIALIZACIÓN MONGODB - UPT CHAT SYSTEM
// Basado en análisis del diagrama de clases PlantUML
// ===============================================

// Conectar a la base de datos
db = db.getSiblingDB('upt_chat_system');

print('📊 Inicializando base de datos UPT Chat System...');

// ===============================================
// 1. USUARIOS LOCALES (para autenticación y cache)
// ===============================================
print('👥 Creando colección: users');
db.createCollection('users');

// Índices para optimización
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "uptCode": 1 }, { unique: true, sparse: true });
db.users.createIndex({ "userType": 1 });
db.users.createIndex({ "createdAt": 1 });

// Datos de prueba - Usuarios UPT
db.users.insertMany([
  {
    _id: ObjectId(),
    email: "admin@upt.pe",
    uptCode: "ADM001",
    firstName: "Sistema",
    lastName: "Administrador",
    userType: "admin",
    isActive: true,
    lastLogin: null,
    preferences: {
      language: "es",
      notifications: true,
      theme: "light"
    },
    metadata: {
      fromUPTSystem: false,
      localAccount: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    email: "2019054321@upt.pe",
    uptCode: "2019054321",
    firstName: "Juan Carlos",
    lastName: "Pérez Mamani",
    userType: "student",
    isActive: true,
    lastLogin: null,
    preferences: {
      language: "es",
      notifications: true,
      theme: "light"
    },
    metadata: {
      fromUPTSystem: true,
      career: "Ingeniería de Sistemas",
      semester: 8
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    email: "maria.rodriguez@upt.pe",
    uptCode: "DOC001",
    firstName: "María Elena",
    lastName: "Rodríguez Silva",
    userType: "teacher",
    isActive: true,
    lastLogin: null,
    preferences: {
      language: "es",
      notifications: true,
      theme: "dark"
    },
    metadata: {
      fromUPTSystem: true,
      department: "Ingeniería de Sistemas",
      position: "Docente Principal"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// ===============================================
// 2. SESIONES DE CONVERSACIÓN
// ===============================================
print('💬 Creando colección: chat_sessions');
db.createCollection('chat_sessions');

// Índices para optimización
db.chat_sessions.createIndex({ "sessionToken": 1 }, { unique: true });
db.chat_sessions.createIndex({ "userId": 1 });
db.chat_sessions.createIndex({ "status": 1 });
db.chat_sessions.createIndex({ "startedAt": 1 });
db.chat_sessions.createIndex({ "expiresAt": 1 });

// Datos de prueba - Sesiones
db.chat_sessions.insertMany([
  {
    _id: ObjectId(),
    sessionToken: "sess_demo_" + Date.now(),
    userId: db.users.findOne({"email": "2019054321@upt.pe"})._id,
    status: "active",
    context: {
      userIntent: "academic_inquiry",
      currentTopic: "matricula",
      conversationFlow: "initial"
    },
    messages: [
      {
        id: "msg_001",
        type: "user",
        content: "Hola, necesito ayuda con mi matrícula",
        timestamp: new Date(),
        metadata: {
          confidence: null,
          entities: []
        }
      },
      {
        id: "msg_002", 
        type: "bot",
        content: "¡Hola! Te ayudo con tu consulta sobre matrícula. ¿Qué específicamente necesitas saber?",
        timestamp: new Date(),
        metadata: {
          confidence: 0.95,
          sources: ["faq_matricula"],
          responseTime: 150
        }
      }
    ],
    analytics: {
      messageCount: 2,
      userSatisfaction: null,
      escalated: false,
      responseTime: {
        avg: 150,
        min: 150,
        max: 150
      }
    },
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + 24*60*60*1000), // 24 horas
    endedAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// ===============================================
// 3. BASE DE CONOCIMIENTO (FAQs)
// ===============================================
print('📚 Creando colección: knowledge_base');
db.createCollection('knowledge_base');

// Índices para búsqueda optimizada
db.knowledge_base.createIndex({ "category": 1 });
db.knowledge_base.createIndex({ "keywords": 1 });
db.knowledge_base.createIndex({ "isActive": 1 });
db.knowledge_base.createIndex({ "priority": 1 });
db.knowledge_base.createIndex({ "$**": "text" }); // Índice de texto completo

// Datos de prueba - FAQs UPT
db.knowledge_base.insertMany([
  {
    _id: ObjectId(),
    category: "academico",
    subcategory: "matricula",
    question: "¿Cómo puedo matricularme en el siguiente semestre?",
    answer: "Para matricularte en el siguiente semestre debes: 1) Verificar que no tengas deudas pendientes, 2) Revisar la malla curricular y prerrequisitos, 3) Ingresar al sistema académico UPT, 4) Seleccionar tus materias según disponibilidad, 5) Confirmar tu matrícula antes de la fecha límite.",
    keywords: ["matricula", "semestre", "inscripcion", "registro"],
    priority: 1,
    isActive: true,
    usageCount: 45,
    lastUsed: new Date(),
    sources: ["manual_estudiante", "reglamento_academico"],
    metadata: {
      createdBy: "admin@upt.pe",
      approvedBy: "academic_department",
      version: "1.0"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    category: "tecnico",
    subcategory: "acceso_sistemas",
    question: "No puedo acceder al campus virtual, ¿qué hago?",
    answer: "Si no puedes acceder al campus virtual: 1) Verifica tu código de estudiante y contraseña, 2) Asegúrate de estar usando el navegador actualizado, 3) Limpia el caché y cookies, 4) Si el problema persiste, contacta a soporte técnico al 052-583000 ext. 1500 o envía un correo a soporte@upt.pe",
    keywords: ["campus virtual", "login", "acceso", "contraseña", "sistema"],
    priority: 2,
    isActive: true,
    usageCount: 89,
    lastUsed: new Date(),
    sources: ["manual_tecnico", "faq_sistemas"],
    metadata: {
      createdBy: "soporte@upt.pe",
      approvedBy: "technical_department",
      version: "1.2"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    category: "administrativo", 
    subcategory: "pagos",
    question: "¿Dónde puedo pagar mi pensión mensual?",
    answer: "Puedes pagar tu pensión mensual en: 1) Banco de la Nación (cuenta corriente UPT), 2) Agente BCP más cercano, 3) Plataforma virtual UPT Pay, 4) Caja UPT en horario de 8:00 AM a 5:00 PM. Recuerda que tienes hasta el día 10 de cada mes para evitar mora.",
    keywords: ["pago", "pension", "mensualidad", "banco", "mora"],
    priority: 1,
    isActive: true,
    usageCount: 156,
    lastUsed: new Date(),
    sources: ["manual_pagos", "reglamento_financiero"],
    metadata: {
      createdBy: "finanzas@upt.pe", 
      approvedBy: "financial_department",
      version: "1.1"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    category: "academico",
    subcategory: "horarios", 
    question: "¿Cómo consulto mi horario de clases?",
    answer: "Para consultar tu horario: 1) Ingresa al campus virtual con tu código de estudiante, 2) Ve a la sección 'Mi Horario' o 'Cronograma', 3) Selecciona el semestre actual, 4) También puedes descargarlo en PDF desde 'Reportes Académicos'. Si tienes problemas, contacta a tu coordinador académico.",
    keywords: ["horario", "clases", "cronograma", "campus virtual"],
    priority: 2,
    isActive: true,
    usageCount: 67,
    lastUsed: new Date(),
    sources: ["manual_estudiante", "guia_campus_virtual"],
    metadata: {
      createdBy: "academico@upt.pe",
      approvedBy: "academic_department", 
      version: "1.0"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// ===============================================
// 4. MÉTRICAS Y ANALYTICS
// ===============================================
print('📊 Creando colección: analytics');
db.createCollection('analytics');

// Índices para reportes
db.analytics.createIndex({ "type": 1 });
db.analytics.createIndex({ "timestamp": 1 });
db.analytics.createIndex({ "category": 1 });

// Datos de prueba - Métricas iniciales
db.analytics.insertMany([
  {
    _id: ObjectId(),
    type: "system_usage",
    category: "daily_stats",
    data: {
      date: new Date().toISOString().split('T')[0],
      totalSessions: 15,
      totalMessages: 47,
      averageSessionDuration: 4.5,
      satisfactionScore: 4.2,
      escalationRate: 0.1
    },
    timestamp: new Date(),
    createdAt: new Date()
  },
  {
    _id: ObjectId(), 
    type: "faq_usage",
    category: "knowledge_base",
    data: {
      date: new Date().toISOString().split('T')[0],
      topQuestions: [
        { category: "administrativo", count: 89 },
        { category: "academico", count: 67 },
        { category: "tecnico", count: 45 }
      ],
      totalQueries: 201
    },
    timestamp: new Date(),
    createdAt: new Date()
  }
]);

// ===============================================
// 5. CONFIGURACIONES DEL SISTEMA
// ===============================================
print('⚙️ Creando colección: system_config');
db.createCollection('system_config');

db.system_config.insertOne({
  _id: ObjectId(),
  key: "nlp_settings",
  value: {
    confidenceThreshold: 0.7,
    maxResponseTime: 5000,
    fallbackEnabled: true,
    supportedLanguages: ["es", "en"],
    escalationThreshold: 0.3
  },
  description: "Configuración del servicio NLP",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

db.system_config.insertOne({
  _id: ObjectId(),
  key: "chat_settings", 
  value: {
    sessionTimeout: 1440, // 24 horas en minutos
    maxMessagesPerSession: 100,
    rateLimitPerMinute: 30,
    enableFileUpload: false,
    maxFileSize: 5242880 // 5MB
  },
  description: "Configuración del sistema de chat",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// ===============================================
// 6. LOGS Y AUDITORÍA
// ===============================================
print('📝 Creando colección: audit_logs');
db.createCollection('audit_logs');

// Índices para logs
db.audit_logs.createIndex({ "timestamp": 1 });
db.audit_logs.createIndex({ "level": 1 });
db.audit_logs.createIndex({ "userId": 1 });

// Log inicial
db.audit_logs.insertOne({
  _id: ObjectId(),
  level: "info",
  action: "system_initialization",
  userId: null,
  message: "Base de datos UPT Chat System inicializada correctamente",
  metadata: {
    collections_created: ["users", "chat_sessions", "knowledge_base", "analytics", "system_config", "audit_logs"],
    initial_data_loaded: true,
    version: "1.0.0"
  },
  timestamp: new Date(),
  createdAt: new Date()
});

// ===============================================
// RESUMEN DE INICIALIZACIÓN
// ===============================================
print('');
print('✅ ===============================================');
print('✅ BASE DE DATOS UPT CHAT SYSTEM INICIALIZADA');
print('✅ ===============================================');
print('📊 Colecciones creadas:');
print('   👥 users (3 usuarios de prueba)');
print('   💬 chat_sessions (1 sesión demo)');
print('   📚 knowledge_base (4 FAQs UPT)');
print('   📊 analytics (métricas iniciales)');
print('   ⚙️ system_config (configuraciones)');
print('   📝 audit_logs (registro de auditoría)');
print('');
print('🔑 Usuarios de prueba creados:');
print('   👑 admin@upt.pe (Administrador)');
print('   🎓 2019054321@upt.pe (Estudiante)');
print('   👨‍🏫 maria.rodriguez@upt.pe (Docente)');
print('');
print('🚀 Sistema listo para pruebas!');
print('===============================================');