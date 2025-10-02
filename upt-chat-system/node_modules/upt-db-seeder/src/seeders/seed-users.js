const User = require('../models/User');

const seedUsers = async () => {
  try {
    // Limpiar usuarios existentes
    await User.deleteMany({});
    console.log('🧹 Usuarios existentes eliminados');

    // Datos de usuarios específicos para UPT
    const users = [
      // ESTUDIANTES
      {
        email: 'juan.perez@upt.edu.pe',
        password: 'password123',
        fullName: { firstName: 'Juan Carlos', lastName: 'Pérez Mamani' },
        role: 'student',
        profile: {
          department: 'Sistemas',
          faculty: 'Ingeniería',
          studentId: '2021054321',
          phoneNumber: '+51987654321'
        },
        emailVerified: true
      },
      {
        email: 'maria.rodriguez@upt.edu.pe',
        password: 'password123',
        fullName: { firstName: 'María Elena', lastName: 'Rodríguez Quispe' },
        role: 'student',
        profile: {
          department: 'Industrial',
          faculty: 'Ingeniería',
          studentId: '2020043210',
          phoneNumber: '+51976543210'
        },
        emailVerified: true
      },
      {
        email: 'carlos.mamani@upt.edu.pe',
        password: 'password123',
        fullName: { firstName: 'Carlos Alberto', lastName: 'Mamani Condori' },
        role: 'student',
        profile: {
          department: 'Civil',
          faculty: 'Ingeniería',
          studentId: '2019032109',
          phoneNumber: '+51965432109'
        },
        emailVerified: true
      },
      {
        email: 'ana.flores@upt.edu.pe',
        password: 'password123',
        fullName: { firstName: 'Ana Lucía', lastName: 'Flores Vargas' },
        role: 'student',
        profile: {
          department: 'Derecho',
          faculty: 'Derecho y Ciencias Políticas',
          studentId: '2021065432',
          phoneNumber: '+51954321098'
        },
        emailVerified: true
      },
      {
        email: 'luis.torres@upt.edu.pe',
        password: 'password123',
        fullName: { firstName: 'Luis Fernando', lastName: 'Torres Apaza' },
        role: 'student',
        profile: {
          department: 'Contabilidad',
          faculty: 'Ciencias Empresariales',
          studentId: '2020076543',
          phoneNumber: '+51943210987'
        },
        emailVerified: true
      },

      // DOCENTES
      {
        email: 'dr.gonzales@upt.pe',
        password: 'password123',
        fullName: { firstName: 'Roberto Carlos', lastName: 'González Huanca' },
        role: 'teacher',
        profile: {
          department: 'Sistemas',
          faculty: 'Ingeniería',
          employeeId: 'DOC001',
          phoneNumber: '+51932109876'
        },
        emailVerified: true
      },
      {
        email: 'dra.martinez@upt.pe',
        password: 'password123',
        fullName: { firstName: 'Carmen Rosa', lastName: 'Martínez Vilca' },
        role: 'teacher',
        profile: {
          department: 'Industrial',
          faculty: 'Ingeniería',
          employeeId: 'DOC002',
          phoneNumber: '+51921098765'
        },
        emailVerified: true
      },
      {
        email: 'mg.quispe@upt.pe',
        password: 'password123',
        fullName: { firstName: 'Pedro Miguel', lastName: 'Quispe Mamani' },
        role: 'teacher',
        profile: {
          department: 'Derecho',
          faculty: 'Derecho y Ciencias Políticas',
          employeeId: 'DOC003',
          phoneNumber: '+51910987654'
        },
        emailVerified: true
      },

      // ADMINISTRATIVOS
      {
        email: 'admin.sistemas@upt.pe',
        password: 'admin123',
        fullName: { firstName: 'Miguel Angel', lastName: 'Herrera Cruz' },
        role: 'admin',
        profile: {
          department: 'TI',
          faculty: 'Administración',
          employeeId: 'ADM001',
          phoneNumber: '+51909876543'
        },
        emailVerified: true
      },
      {
        email: 'soporte.tecnico@upt.pe',
        password: 'soporte123',
        fullName: { firstName: 'Piero Alexander', lastName: 'Paja de la Cruz' },
        role: 'staff',
        profile: {
          department: 'Soporte Técnico',
          faculty: 'Administración',
          employeeId: 'STAFF001',
          phoneNumber: '+51998765432'
        },
        emailVerified: true
      },

      // MÁS ESTUDIANTES PARA DIVERSIDAD
      {
        email: 'sofia.condori@upt.edu.pe',
        password: 'password123',
        fullName: { firstName: 'Sofía Alejandra', lastName: 'Condori Mamani' },
        role: 'student',
        profile: {
          department: 'Arquitectura',
          faculty: 'Arquitectura y Urbanismo',
          studentId: '2021087654',
          phoneNumber: '+51987654321'
        },
        emailVerified: true
      },
      {
        email: 'diego.vargas@upt.edu.pe',
        password: 'password123',
        fullName: { firstName: 'Diego Alonso', lastName: 'Vargas Huanca' },
        role: 'student',
        profile: {
          department: 'Medicina',
          faculty: 'Ciencias de la Salud',
          studentId: '2020098765',
          phoneNumber: '+51976543210'
        },
        emailVerified: true
      }
    ];

    // Insertar usuarios
    const insertedUsers = await User.insertMany(users);
    
    console.log(`✅ ${insertedUsers.length} usuarios insertados correctamente`);
    
    return {
      success: true,
      count: insertedUsers.length,
      breakdown: {
        students: insertedUsers.filter(u => u.role === 'student').length,
        teachers: insertedUsers.filter(u => u.role === 'teacher').length,
        admin: insertedUsers.filter(u => u.role === 'admin').length,
        staff: insertedUsers.filter(u => u.role === 'staff').length
      }
    };

  } catch (error) {
    console.error('❌ Error seeding usuarios:', error);
    throw error;
  }
};

module.exports = seedUsers;