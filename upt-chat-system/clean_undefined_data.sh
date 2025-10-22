#!/bin/bash
# Script para limpiar datos basura con sessionId "undefined"

echo "🧹 Limpiando datos basura de MongoDB..."

# Usar mongosh para limpiar directamente
mongosh "mongodb+srv://sistemaweb:7bmdHshRtVBKsP09@cluster0.wohly.mongodb.net/chatbot_database" << 'EOF'

use chatbot_database

console.log("🔍 Contando mensajes con sessionId 'undefined'...");
const messagesCount = db.messages.countDocuments({ sessionId: "undefined" });
console.log(`📊 Mensajes a eliminar: ${messagesCount}`);

console.log("🔍 Contando sesiones con _id 'undefined'...");
const sessionsCount = db.chat_sessions.countDocuments({ _id: "undefined" });
console.log(`📊 Sesiones a eliminar: ${sessionsCount}`);

console.log("\n🗑️  Eliminando mensajes...");
const messagesResult = db.messages.deleteMany({ sessionId: "undefined" });
console.log(`✅ Mensajes eliminados: ${messagesResult.deletedCount}`);

console.log("\n🗑️  Eliminando sesiones...");
const sessionsResult = db.chat_sessions.deleteMany({ _id: "undefined" });
console.log(`✅ Sesiones eliminadas: ${sessionsResult.deletedCount}`);

console.log("\n✅ Limpieza completada");
exit

EOF

echo "✅ Proceso terminado"
