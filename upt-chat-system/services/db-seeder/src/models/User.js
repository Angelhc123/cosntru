const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema de Usuario (copiado del API Gateway)
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fullName: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    }
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin', 'staff'],
    default: 'student'
  },
  profile: {
    department: String,
    faculty: String,
    studentId: String,
    employeeId: String,
    phoneNumber: String,
    avatar: String
  },
  preferences: {
    language: {
      type: String,
      enum: ['es', 'en'],
      default: 'es'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLogin: Date,
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Hash password antes de guardar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);