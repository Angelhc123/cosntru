// MongoDB Initialization Script for UPT Chat System

// Switch to the database
db = db.getSiblingDB('upt_chat_system');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'firstName', 'lastName', 'userType'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          description: 'Must be a valid email address'
        },
        firstName: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 50,
          description: 'Must be a string between 2-50 characters'
        },
        lastName: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 50,
          description: 'Must be a string between 2-50 characters'
        },
        userType: {
          bsonType: 'string',
          enum: ['student', 'teacher', 'admin', 'staff'],
          description: 'Must be one of: student, teacher, admin, staff'
        },
        isActive: {
          bsonType: 'bool',
          description: 'Must be a boolean'
        }
      }
    }
  }
});

db.createCollection('chat_sessions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'sessionToken'],
      properties: {
        userId: {
          bsonType: 'string',
          description: 'Must be a valid user ID'
        },
        sessionToken: {
          bsonType: 'string',
          minLength: 10,
          description: 'Must be a valid session token'
        },
        isActive: {
          bsonType: 'bool',
          description: 'Must be a boolean'
        },
        metadata: {
          bsonType: 'object',
          properties: {
            totalMessages: {
              bsonType: 'int',
              minimum: 0
            },
            avgResponseTime: {
              bsonType: 'number',
              minimum: 0
            },
            satisfactionScore: {
              bsonType: 'int',
              minimum: 1,
              maximum: 5
            }
          }
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ 'email': 1 }, { unique: true, name: 'unique_email' });
db.users.createIndex({ 'userType': 1, 'isActive': 1 }, { name: 'user_type_active' });
db.users.createIndex({ 'createdAt': -1 }, { name: 'created_at_desc' });
db.users.createIndex(
  { 'firstName': 'text', 'lastName': 'text', 'email': 'text' },
  { name: 'user_search_text' }
);

db.chat_sessions.createIndex({ 'userId': 1, 'isActive': 1 }, { name: 'user_active_sessions' });
db.chat_sessions.createIndex({ 'sessionToken': 1 }, { unique: true, name: 'unique_session_token' });
db.chat_sessions.createIndex({ 'startedAt': -1 }, { name: 'started_at_desc' });
db.chat_sessions.createIndex({ 'endedAt': -1 }, { name: 'ended_at_desc' });
db.chat_sessions.createIndex(
  { 'startedAt': 1 },
  { 
    expireAfterSeconds: 2592000, // 30 days TTL
    name: 'session_ttl'
  }
);

// Insert sample data for testing
db.users.insertMany([
  {
    email: 'admin@upt.pe',
    firstName: 'Administrador',
    lastName: 'Sistema',
    userType: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'estudiante.test@upt.pe',
    firstName: 'Juan',
    lastName: 'Pérez',
    userType: 'student',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'docente.test@upt.pe',
    firstName: 'María',
    lastName: 'García',
    userType: 'teacher',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create user for application
db.createUser({
  user: 'upt_app_user',
  pwd: 'upt_app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'upt_chat_system'
    }
  ]
});

print('✅ Base de datos UPT Chat System inicializada exitosamente');
print('📊 Colecciones creadas: users, chat_sessions');
print('🔍 Índices optimizados creados');
print('👤 Usuario de aplicación creado: upt_app_user');
print('🧪 Datos de prueba insertados');