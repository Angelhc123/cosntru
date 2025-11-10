/**
 * Script para insertar datos simulados para analytics
 * Se puede ejecutar desde MongoDB Compass o línea de comandos
 */

// INSERTAR FAQs CON DATOS DE USO
db.faqs.insertMany([
  {
    question: "¿Cuáles son los horarios de atención?",
    answer: "Nuestros horarios de atención son de lunes a viernes de 8:00 AM a 6:00 PM",
    category: "horarios",
    status: "active",
    usage_count: 87,
    positive_feedback: 15,
    negative_feedback: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "¿Cómo puedo recuperar mi contraseña?",
    answer: "Puedes recuperar tu contraseña haciendo clic en 'Olvidé mi contraseña' en la página de login",
    category: "cuenta",
    status: "active",
    usage_count: 65,
    positive_feedback: 18,
    negative_feedback: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "¿Dónde puedo encontrar mi historial académico?",
    answer: "Puedes encontrar tu historial académico en el portal de estudiante, sección 'Mi historial'",
    category: "academico",
    status: "active",
    usage_count: 54,
    positive_feedback: 12,
    negative_feedback: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "¿Cuándo son los períodos de inscripción?",
    answer: "Los períodos de inscripción generalmente son en enero, mayo y septiembre",
    category: "inscripciones",
    status: "active",
    usage_count: 43,
    positive_feedback: 8,
    negative_feedback: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "¿Cómo contacto con el soporte técnico?",
    answer: "Puedes contactar al soporte técnico llamando al 123-456-7890 o por email a soporte@upt.edu",
    category: "soporte",
    status: "active",
    usage_count: 38,
    positive_feedback: 14,
    negative_feedback: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "¿Qué documentos necesito para la matrícula?",
    answer: "Para la matrícula necesitas cédula, certificado de bachillerato y comprobante de pago",
    category: "matricula",
    status: "active",
    usage_count: 29,
    positive_feedback: 11,
    negative_feedback: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "¿Hay becas disponibles?",
    answer: "Sí, tenemos becas académicas y socioeconómicas. Consulta en la oficina de bienestar estudiantil",
    category: "becas",
    status: "active",
    usage_count: 22,
    positive_feedback: 9,
    negative_feedback: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "¿Dónde está la biblioteca?",
    answer: "La biblioteca está ubicada en el edificio central, segundo piso",
    category: "ubicaciones",
    status: "active",
    usage_count: 18,
    positive_feedback: 6,
    negative_feedback: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "¿Cómo puedo ver mis notas?",
    answer: "Puedes ver tus notas en el portal estudiantil, sección 'Calificaciones'",
    category: "notas",
    status: "active",
    usage_count: 15,
    positive_feedback: 4,
    negative_feedback: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "¿Cuál es el proceso de graduación?",
    answer: "El proceso de graduación incluye completar todos los créditos, defender tu tesis y pagar los derechos de grado",
    category: "graduacion",
    status: "active",
    usage_count: 12,
    positive_feedback: 7,
    negative_feedback: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

console.log("✅ FAQs simuladas insertadas correctamente");