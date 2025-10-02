const mongoose = require('mongoose');

// Esquema de Sesión de Chat (copiado del API Gateway)
const ChatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  messages: [{
    messageId: String,
    sender: {
      type: String,
      enum: ['user', 'bot', 'agent'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      confidence: Number,
      intent: String,
      entities: [mongoose.Schema.Types.Mixed]
    }
  }],
  summary: {
    totalMessages: {
      type: Number,
      default: 0
    },
    userMessages: {
      type: Number,
      default: 0
    },
    botMessages: {
      type: Number,
      default: 0
    },
    avgConfidence: Number,
    mainTopics: [String],
    resolved: {
      type: Boolean,
      default: false
    }
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    helpful: Boolean,
    timestamp: Date
  },
  context: {
    userAgent: String,
    ip: String,
    referrer: String,
    device: String,
    location: String
  }
}, {
  timestamps: true,
  collection: 'chat_sessions'
});

// Índices para optimizar consultas
ChatSessionSchema.index({ userId: 1, createdAt: -1 });
ChatSessionSchema.index({ status: 1 });

module.exports = mongoose.model('ChatSession', ChatSessionSchema);