const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://sistemaweb:7bmdHshRtVBKsP09@cluster0.wohly.mongodb.net/chatbot_database?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Conectado a MongoDB');
  
  const db = mongoose.connection.db;
  
  // Eliminar mensajes con sessionId: "undefined"
  const messagesResult = await db.collection('messages').deleteMany({ sessionId: 'undefined' });
  console.log(`🗑️  Eliminados ${messagesResult.deletedCount} mensajes con sessionId: "undefined"`);
  
  // Eliminar sesiones con _id: "undefined" 
  const sessionsResult = await db.collection('chat_sessions').deleteMany({ _id: 'undefined' });
  console.log(`🗑️  Eliminadas ${sessionsResult.deletedCount} sesiones con _id: "undefined"`);
  
  console.log('✅ Limpieza completada');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
