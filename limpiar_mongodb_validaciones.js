// Script para limpiar validaciones duplicadas en MongoDB
// Ejecutar en MongoDB Compass o shell

use('upt_chat_system');

// Limpiar validationnotifications duplicadas
db.validationnotifications.deleteMany({});

// Limpiar tokens duplicados también
db.passwordresettokens.deleteMany({});

print("✅ Validaciones y tokens limpiados");