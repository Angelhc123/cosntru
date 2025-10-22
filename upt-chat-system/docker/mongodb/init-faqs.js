// Conectar a la base de datos del chatbot
db = db.getSiblingDB('upt_chat_system');

// Limpiar colección anterior si existe
db.faqs.drop();

// Crear colección con validación
db.createCollection('faqs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['nombre', 'texto_chat', 'activo', 'orden'],
      properties: {
        nombre: {
          bsonType: 'string',
          description: 'Nombre de la pregunta frecuente - requerido'
        },
        texto_chat: {
          bsonType: 'string',
          description: 'Texto que se enviará al chat - requerido'
        },
        activo: {
          bsonType: 'bool',
          description: 'Estado de la FAQ - requerido'
        },
        orden: {
          bsonType: 'int',
          description: 'Orden de visualización - requerido'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Fecha de creación'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Fecha de actualización'
        }
      }
    }
  }
});

// Insertar FAQs por defecto
db.faqs.insertMany([
  {
    nombre: 'Olvidé mi contraseña',
    texto_chat: 'olvidé mi contraseña',
    activo: true,
    orden: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nombre: 'Pregunta Frecuente 1',
    texto_chat: 'pregunta frecuente 1',
    activo: true,
    orden: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nombre: 'Pregunta Frecuente 2',
    texto_chat: 'pregunta frecuente 2',
    activo: true,
    orden: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nombre: 'Pregunta Frecuente 3',
    texto_chat: 'pregunta frecuente 3',
    activo: true,
    orden: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Crear índices
db.faqs.createIndex({ 'nombre': 1 }, { unique: true });
db.faqs.createIndex({ 'activo': 1, 'orden': 1 });

print('✅ Colección FAQs creada con 4 preguntas por defecto');
print('📊 Total FAQs insertadas:', db.faqs.countDocuments());
