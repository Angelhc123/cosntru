const ChatSession = require('../models/ChatSession');
const User = require('../models/User');
const { randomUUID } = require('crypto');

const seedChatSessions = async () => {
  try {
    // Limpiar sesiones existentes
    await ChatSession.deleteMany({});
    console.log('🧹 Sesiones de chat existentes eliminadas');

    // Obtener algunos usuarios para asociar sesiones
    const users = await User.find().limit(5);
    if (users.length === 0) {
      throw new Error('No hay usuarios disponibles. Ejecuta seed de usuarios primero.');
    }

    const chatSessions = [];
    
    // Generar sesiones de ejemplo
    for (let i = 0; i < 25; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const sessionId = randomUUID();
      
      // Generar mensajes de ejemplo
      const messages = [];
      const messageCount = Math.floor(Math.random() * 10) + 3; // 3-12 mensajes
      
      for (let j = 0; j < messageCount; j++) {
        if (j % 2 === 0) {
          // Mensaje del usuario
          messages.push({
            messageId: randomUUID(),
            sender: 'user',
            content: getRandomUserMessage(),
            timestamp: new Date(Date.now() - (messageCount - j) * 60000), // Espaciados por minutos
            metadata: {}
          });
        } else {
          // Respuesta del bot
          messages.push({
            messageId: randomUUID(),
            sender: 'bot',
            content: getRandomBotResponse(),
            timestamp: new Date(Date.now() - (messageCount - j) * 60000 + 30000), // 30 segundos después
            metadata: {
              confidence: Math.random() * 0.3 + 0.7, // Confianza entre 0.7 y 1.0
              intent: getRandomIntent(),
              entities: []
            }
          });
        }
      }

      const status = ['active', 'completed', 'abandoned'][Math.floor(Math.random() * 3)];
      const isCompleted = status === 'completed';
      
      const session = {
        sessionId,
        userId: randomUser._id,
        status,
        startTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Última semana
        endTime: isCompleted ? new Date() : undefined,
        messages,
        summary: {
          totalMessages: messages.length,
          userMessages: messages.filter(m => m.sender === 'user').length,
          botMessages: messages.filter(m => m.sender === 'bot').length,
          avgConfidence: messages
            .filter(m => m.metadata.confidence)
            .reduce((acc, m) => acc + m.metadata.confidence, 0) / 
            messages.filter(m => m.metadata.confidence).length || 0,
          mainTopics: getRandomTopics(),
          resolved: isCompleted ? Math.random() > 0.3 : false // 70% de sesiones completadas son resueltas
        },
        feedback: isCompleted && Math.random() > 0.5 ? {
          rating: Math.floor(Math.random() * 2) + 4, // Rating 4-5
          comment: getRandomFeedback(),
          helpful: Math.random() > 0.2, // 80% helpful
          timestamp: new Date()
        } : undefined,
        context: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          referrer: 'https://upt.edu.pe',
          device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
          location: 'Tacna, Perú'
        }
      };

      chatSessions.push(session);
    }

    // Insertar sesiones
    const insertedSessions = await ChatSession.insertMany(chatSessions);
    
    console.log(`✅ ${insertedSessions.length} sesiones de chat insertadas correctamente`);
    
    return {
      success: true,
      count: insertedSessions.length,
      breakdown: {
        active: insertedSessions.filter(s => s.status === 'active').length,
        completed: insertedSessions.filter(s => s.status === 'completed').length,
        abandoned: insertedSessions.filter(s => s.status === 'abandoned').length
      }
    };

  } catch (error) {
    console.error('❌ Error seeding chat sessions:', error);
    throw error;
  }
};

// Funciones auxiliares para generar contenido realista
function getRandomUserMessage() {
  const messages = [
    '¿Cómo puedo matricularme para el próximo semestre?',
    'Necesito información sobre becas disponibles',
    '¿Cuáles son los horarios de la biblioteca?',
    'Tengo problemas para acceder al aula virtual',
    '¿Dónde puedo pagar mi pensión estudiantil?',
    'Necesito el certificado de estudios',
    '¿Cuándo son los exámenes finales?',
    'No puedo ver mis notas en el sistema',
    '¿Cómo contacto con mi asesor académico?',
    'Información sobre prácticas profesionales',
    '¿Qué documentos necesito para titularme?',
    'Tengo dudas sobre mi malla curricular'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function getRandomBotResponse() {
  const responses = [
    'Te ayudo con información sobre el proceso de matrícula. Puedes acceder al sistema desde...',
    'Para información sobre becas, te recomiendo contactar con Bienestar Estudiantil en...',
    'La biblioteca tiene horarios de 7:00 AM a 10:00 PM de lunes a sábado...',
    'Para problemas con el aula virtual, puedes contactar con soporte técnico al...',
    'Los pagos se pueden realizar en tesorería o a través de los bancos autorizados...',
    'Para solicitar certificados, debes dirigirte a la oficina de registros académicos...',
    'Las fechas de exámenes finales se publican en el calendario académico disponible en...',
    'Si no puedes ver tus notas, verifica que no tengas pagos pendientes...',
    'Tu asesor académico está asignado según tu facultad. Puedes encontrar su información en...',
    'Para prácticas profesionales, debes haber completado el 75% de tu carrera...',
    'Los requisitos para titulación incluyen: expediente completo, no tener deudas...',
    'Tu malla curricular está disponible en tu portal estudiante, sección académica...'
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function getRandomIntent() {
  const intents = [
    'matricula_info',
    'becas_consulta',
    'biblioteca_horarios',
    'soporte_tecnico',
    'pagos_consulta',
    'certificados_tramite',
    'examenes_fechas',
    'notas_consulta',
    'asesoria_academica',
    'practicas_info',
    'titulacion_requisitos',
    'malla_curricular'
  ];
  return intents[Math.floor(Math.random() * intents.length)];
}

function getRandomTopics() {
  const topics = [
    ['matrícula', 'inscripción'],
    ['becas', 'apoyo económico'],
    ['biblioteca', 'horarios'],
    ['soporte', 'técnico', 'sistema'],
    ['pagos', 'pensiones'],
    ['certificados', 'documentos'],
    ['exámenes', 'evaluaciones'],
    ['notas', 'calificaciones'],
    ['asesoría', 'académica'],
    ['prácticas', 'profesionales'],
    ['titulación', 'grado'],
    ['curricular', 'plan de estudios']
  ];
  return topics[Math.floor(Math.random() * topics.length)];
}

function getRandomFeedback() {
  const feedback = [
    'Muy útil la información proporcionada',
    'Resolvió completamente mi consulta',
    'Rápido y eficiente',
    'La información estaba actualizada',
    'Excelente servicio de atención',
    'Me ayudó mucho, gracias',
    'Claro y preciso en las respuestas'
  ];
  return feedback[Math.floor(Math.random() * feedback.length)];
}

module.exports = seedChatSessions;