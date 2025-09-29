import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserType } from '../../../domain/entities/user.entity';

/**
 * MongoDB Schema: User
 * Define el esquema de base de datos para la entidad User
 */
@Schema({
  collection: 'users',
  timestamps: true,
  versionKey: false
})
export class UserDocument extends Document {
  @Prop({ 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido']
  })
  email: string;

  @Prop({ 
    required: true, 
    trim: true,
    minlength: 2,
    maxlength: 50
  })
  firstName: string;

  @Prop({ 
    required: true, 
    trim: true,
    minlength: 2,
    maxlength: 50
  })
  lastName: string;

  @Prop({ 
    required: true,
    enum: Object.values(UserType),
    type: String
  })
  userType: UserType;

  @Prop({ 
    default: true,
    type: Boolean
  })
  isActive: boolean;

  @Prop({ 
    default: Date.now,
    type: Date
  })
  createdAt: Date;

  @Prop({ 
    default: Date.now,
    type: Date
  })
  updatedAt: Date;

  // Virtual para el nombre completo
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

// Índices para optimizar consultas
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ userType: 1, isActive: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  email: 'text' 
}, { 
  name: 'user_search_index' 
});

// Virtual para fullName
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Asegurar que los virtuals se incluyan en JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });