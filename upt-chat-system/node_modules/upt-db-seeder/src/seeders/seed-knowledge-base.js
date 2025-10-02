const mongoose = require('mongoose');

// Esquema para la base de conocimiento
const KnowledgeBaseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['academico', 'administrativo', 'servicios', 'tramites', 'tecnologia', 'general']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [String],
  keywords: [String],
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'active'
  },
  metadata: {
    author: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    version: {
      type: String,
      default: '1.0'
    },
    views: {
      type: Number,
      default: 0
    },
    helpful: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  collection: 'knowledge_base'
});

const KnowledgeBase = mongoose.model('KnowledgeBase', KnowledgeBaseSchema);

const seedKnowledgeBase = async () => {
  try {
    // Limpiar base de conocimiento existente
    await KnowledgeBase.deleteMany({});
    console.log('🧹 Base de conocimiento existente eliminada');

    const knowledgeItems = [
      // ACADÉMICO
      {
        category: 'academico',
        title: '¿Cómo realizar la matrícula para el nuevo semestre?',
        content: 'Para matricularte debes: 1) Estar al día en pagos, 2) Ingresar al sistema académico con tu usuario y contraseña, 3) Seleccionar los cursos disponibles según tu malla curricular, 4) Confirmar la matrícula antes de la fecha límite. El proceso está disponible desde el portal estudiantil.',
        tags: ['matricula', 'inscripcion', 'semestre'],
        keywords: ['matricular', 'inscribir', 'cursos', 'semestre', 'portal'],
        priority: 5,
        metadata: {
          author: 'Registro Académico',
          views: 45,
          helpful: 42
        }
      },
      {
        category: 'academico',
        title: 'Calendario académico y fechas importantes',
        content: 'El calendario académico incluye: Matrícula (15-31 enero), Inicio de clases (1 marzo), Exámenes parciales (15-30 abril), Exámenes finales (15-30 julio), Vacaciones (agosto), Inicio segundo semestre (1 septiembre). Consulta actualizaciones en la web oficial.',
        tags: ['calendario', 'fechas', 'examenes'],
        keywords: ['calendario', 'fechas', 'examenes', 'vacaciones', 'semestre'],
        priority: 4,
        metadata: {
          author: 'Secretaría Académica',
          views: 38,
          helpful: 35
        }
      },
      {
        category: 'academico',
        title: 'Consulta de notas y récord académico',
        content: 'Puedes consultar tus notas ingresando al portal estudiantil > Sección Académica > Notas por ciclo. También puedes descargar tu récord académico completo. Si no aparecen las notas, verifica que no tengas pagos pendientes o contacta con tu facultad.',
        tags: ['notas', 'calificaciones', 'record'],
        keywords: ['notas', 'calificaciones', 'record', 'académico', 'portal'],
        priority: 5,
        metadata: {
          author: 'Sistema Académico',
          views: 67,
          helpful: 61
        }
      },

      // ADMINISTRATIVO
      {
        category: 'administrativo',
        title: 'Formas de pago de pensiones estudiantiles',
        content: 'Puedes pagar tus pensiones mediante: 1) Banco de la Nación (cuenta corriente 00-123-456789), 2) BCP (cuenta 123-456-789-0-12), 3) Interbank, 4) Caja en tesorería UPT (horario 8:00-16:00). Conserva siempre tu voucher de pago.',
        tags: ['pagos', 'pensiones', 'bancos'],
        keywords: ['pagar', 'pension', 'banco', 'tesoreria', 'voucher'],
        priority: 5,
        metadata: {
          author: 'Tesorería UPT',
          views: 89,
          helpful: 82
        }
      },
      {
        category: 'administrativo',
        title: 'Becas y apoyo económico disponible',
        content: 'UPT ofrece: Beca de Excelencia Académica (promedio >16), Beca de Apoyo Económico (situación familiar), Beca Deportiva, Beca de Trabajo. Requisitos y postulación en Bienestar Estudiantil, 2do piso, oficina 201.',
        tags: ['becas', 'apoyo', 'economico'],
        keywords: ['beca', 'apoyo', 'económico', 'excelencia', 'bienestar'],
        priority: 4,
        metadata: {
          author: 'Bienestar Estudiantil',
          views: 52,
          helpful: 47
        }
      },

      // SERVICIOS
      {
        category: 'servicios',
        title: 'Horarios y servicios de la biblioteca',
        content: 'Biblioteca Central: Lunes a Viernes 7:00-22:00, Sábados 8:00-18:00. Servicios: Préstamo de libros, salas de estudio, computadoras, Wi-Fi gratuito, impresiones. Biblioteca Digital disponible 24/7 desde el portal.',
        tags: ['biblioteca', 'horarios', 'servicios'],
        keywords: ['biblioteca', 'horarios', 'libros', 'estudio', 'wifi'],
        priority: 4,
        metadata: {
          author: 'Biblioteca Central',
          views: 76,
          helpful: 70
        }
      },
      {
        category: 'servicios',
        title: 'Laboratorios de cómputo y software disponible',
        content: 'Disponemos de 5 laboratorios con 120 computadoras. Software: Office 365, Visual Studio, AutoCAD, MATLAB, SPSS, Adobe Creative Suite. Horarios: L-V 7:00-21:00, S 8:00-16:00. Reserva de laboratorios para clases con coordinación académica.',
        tags: ['laboratorios', 'computo', 'software'],
        keywords: ['laboratorio', 'computadoras', 'software', 'autocad', 'office'],
        priority: 3,
        metadata: {
          author: 'Centro de Cómputo',
          views: 34,
          helpful: 29
        }
      },

      // TRÁMITES
      {
        category: 'tramites',
        title: 'Certificados de estudios y constancias',
        content: 'Para solicitar certificados: 1) Llenar formulario en Registro Académico, 2) Pagar derecho de trámite S/. 15, 3) Presentar DNI y voucher de pago, 4) Recoger en 3 días hábiles. Constancias simples se entregan el mismo día.',
        tags: ['certificados', 'constancias', 'tramites'],
        keywords: ['certificado', 'constancia', 'estudios', 'registro', 'academico'],
        priority: 4,
        metadata: {
          author: 'Registro Académico',
          views: 43,
          helpful: 38
        }
      },
      {
        category: 'tramites',
        title: 'Proceso de titulación y grados académicos',
        content: 'Requisitos para titulación: 1) Haber aprobado todas las materias, 2) No tener deudas pendientes, 3) Presentar proyecto de tesis o examen de suficiencia, 4) Pago de derechos. El proceso completo toma 3-6 meses según modalidad.',
        tags: ['titulacion', 'grado', 'tesis'],
        keywords: ['titulo', 'grado', 'tesis', 'sustentacion', 'requisitos'],
        priority: 5,
        metadata: {
          author: 'Secretaría General',
          views: 91,
          helpful: 85
        }
      },

      // TECNOLOGÍA
      {
        category: 'tecnologia',
        title: 'Acceso al aula virtual y plataforma educativa',
        content: 'Aula Virtual UPT: https://virtual.upt.edu.pe. Usuario: tu código estudiantil, Contraseña inicial: tu DNI. Si tienes problemas de acceso contacta soporte técnico: soporte@upt.edu.pe o extensión 101. Disponible cursos, materiales, tareas y foros.',
        tags: ['aula virtual', 'plataforma', 'acceso'],
        keywords: ['virtual', 'plataforma', 'usuario', 'contraseña', 'soporte'],
        priority: 5,
        metadata: {
          author: 'Soporte Técnico',
          views: 78,
          helpful: 71
        }
      },
      {
        category: 'tecnologia',
        title: 'Wi-Fi y conexión a internet en el campus',
        content: 'Red Wi-Fi: "UPT-Estudiantes" y "UPT-Docentes". Usuario: código estudiantil/laboral, Contraseña: DNI. Cobertura en toda la universidad. Velocidad: 100 Mbps. Para problemas de conexión reportar en TI, 1er piso, oficina 105.',
        tags: ['wifi', 'internet', 'conexion'],
        keywords: ['wifi', 'internet', 'red', 'conexion', 'campus'],
        priority: 3,
        metadata: {
          author: 'TI UPT',
          views: 56,
          helpful: 51
        }
      },

      // GENERAL
      {
        category: 'general',
        title: 'Directorio de contactos principales',
        content: 'Contactos principales: Admisión (052) 583000 ext. 200, Registro Académico ext. 150, Tesorería ext. 180, Bienestar Estudiantil ext. 160, Biblioteca ext. 140, Soporte Técnico ext. 101. Email: informes@upt.edu.pe',
        tags: ['contactos', 'telefono', 'directorio'],
        keywords: ['telefono', 'contacto', 'extension', 'email', 'informes'],
        priority: 4,
        metadata: {
          author: 'Administración UPT',
          views: 67,
          helpful: 63
        }
      },
      {
        category: 'general',
        title: 'Horarios de atención de oficinas administrativas',
        content: 'Horarios generales: Lunes a Viernes 8:00-16:00, Sábados 8:00-12:00. Excepciones: Tesorería cierra 15:30, Biblioteca hasta 22:00. Durante período de matrícula horario extendido hasta 20:00. Verificar horarios especiales en web oficial.',
        tags: ['horarios', 'atencion', 'oficinas'],
        keywords: ['horarios', 'oficinas', 'atencion', 'administrativo', 'tesoreria'],
        priority: 3,
        metadata: {
          author: 'Administración UPT',
          views: 41,
          helpful: 37
        }
      }
    ];

    // Insertar elementos de conocimiento
    const insertedItems = await KnowledgeBase.insertMany(knowledgeItems);
    
    console.log(`✅ ${insertedItems.length} elementos de base de conocimiento insertados`);
    
    return {
      success: true,
      count: insertedItems.length,
      breakdown: {
        academico: insertedItems.filter(item => item.category === 'academico').length,
        administrativo: insertedItems.filter(item => item.category === 'administrativo').length,
        servicios: insertedItems.filter(item => item.category === 'servicios').length,
        tramites: insertedItems.filter(item => item.category === 'tramites').length,
        tecnologia: insertedItems.filter(item => item.category === 'tecnologia').length,
        general: insertedItems.filter(item => item.category === 'general').length
      }
    };

  } catch (error) {
    console.error('❌ Error seeding base de conocimiento:', error);
    throw error;
  }
};

module.exports = seedKnowledgeBase;