import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { winstonConfig } from './infrastructure/logging/winston.config';

// Domain Services
import { UserDomainService } from './domain/services/user-domain.service';
import { ChatSessionDomainService } from './domain/services/chat-session-domain.service';

// Use Cases (Solo lectura de BD UPT)
import { 
  GetUserProfileUseCase,
  ValidateUserForChatUseCase,
} from './application/use-cases/user.use-cases';

import {
  StartChatSessionUseCase,
  GetActiveChatSessionUseCase,
  EndChatSessionUseCase,
  ValidateSessionTokenUseCase,
  RecordUserMessageUseCase,
  SetSessionSatisfactionUseCase,
  UpdateSessionMetadataUseCase,
  GetSessionAnalyticsUseCase,
  CleanupExpiredSessionsUseCase
} from './application/use-cases/chat-session.use-cases';

// Controllers
import { UsersController } from './presentation/controllers/users.controller';
import { ChatSessionsController } from './presentation/controllers/chat-sessions.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { PasswordResetController } from './infrastructure/controllers/password-reset.controller';
import { NlpController } from './presentation/controllers/nlp.controller';
import { ConfigController } from './presentation/controllers/config.controller';
import { FaqsController } from './presentation/controllers/faqs.controller';
import { SupportController } from './presentation/controllers/support.controller';
import { AnalyticsController } from './presentation/controllers/analytics.controller';
import { DialogflowController } from './presentation/controllers/dialogflow.controller';

// Auth
import { JwtStrategy } from './infrastructure/auth/strategies/jwt.strategy';
import { AppLoggerService } from './infrastructure/logging/logger.service';
import { HealthCheckUseCase } from './application/use-cases/health.use-cases';

// Infrastructure
import { MongoUserRepository } from './infrastructure/database/repositories/mongo-user.repository';
import { MongoChatSessionRepository } from './infrastructure/database/repositories/mongo-chat-session.repository';
import { UserDocument, UserSchema } from './infrastructure/database/schemas/user.schema';
import { ChatSessionDocument, ChatSessionSchema } from './infrastructure/database/schemas/chat-session.schema';
import { MessageDocument, MessageSchema } from './infrastructure/database/schemas/message.schema';
import { FaqDocument, FaqSchema } from './infrastructure/database/schemas/faq.schema';
import { TicketDocument, TicketSchema } from './infrastructure/database/schemas/ticket.schema';
import { TicketMessageDocument, TicketMessageSchema } from './infrastructure/database/schemas/ticket-message.schema';
import { AnalyticsDocument, AnalyticsSchema } from './infrastructure/database/schemas/analytics.schema';

// RF004 Services
import { MySQLConnectionService } from './infrastructure/services/mysql-connection.service';
import { PasswordResetService } from './application/services/password-reset.service';

// NLP Service
import { NlpService } from './application/services/nlp.service';
import { SupportService } from './application/services/support.service';
import { AnalyticsService } from './application/services/analytics.service';
import { DialogflowService } from './application/services/dialogflow.service';

// Tickets Module
import { TicketsModule } from './presentation/modules/tickets.module';

// Repository Interfaces
import { IUserRepository } from './domain/repositories/user.repository.interface';
import { IChatSessionRepository } from './domain/repositories/chat-session.repository.interface';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/upt_chat_system', {
      dbName: 'upt_chat_system' // Cambio: usar base donde están los datos FAQs
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'ChatSession', schema: ChatSessionSchema },
      { name: 'Message', schema: MessageSchema },
      { name: 'Faq', schema: FaqSchema },
      { name: 'Ticket', schema: TicketSchema },
      { name: 'TicketMessage', schema: TicketMessageSchema },
      { name: 'Analytics', schema: AnalyticsSchema },
      // RF004: Schemas para password reset
      { 
        name: 'PasswordResetToken', 
        schema: new (require('mongoose').Schema)({
          token: { type: String, required: true, unique: true, index: true },
          email: { type: String, required: true, index: true },
          session_id: { type: String, required: true, index: true },
          created_at: { type: Date, default: Date.now },
          expires_at: { type: Date, required: true, index: true },
          used: { type: Boolean, default: false }
        })
      },
      { 
        name: 'ValidationNotification', 
        schema: new (require('mongoose').Schema)({
          session_id: { type: String, required: true, unique: true, index: true },
          status: { type: String, enum: ['pending', 'confirmed', 'expired', 'error'], default: 'pending' },
          message: { type: String, required: true },
          created_at: { type: Date, default: Date.now },
          updated_at: { type: Date, default: Date.now }
        })
      }
    ]),

    // Rate Limiting
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
      limit: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    }]),

    // JWT Authentication
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
      signOptions: {
        expiresIn: '7d',
      },
    }),

    // Winston Logger
    WinstonModule.forRoot(winstonConfig),
    
    // Tickets Module
    TicketsModule,
  ],
  
  controllers: [
    AppController,
    UsersController,
    ChatSessionsController,
    HealthController,
    PasswordResetController, // RF004
    NlpController, // NLP Integration
    ConfigController, // Widget Configuration
    FaqsController, // FAQs Management
    SupportController, // Support Tickets
    AnalyticsController, // Analytics Dashboard
    DialogflowController, // Dialogflow Analytics
  ],
  
  providers: [
    AppService,
    
    // Repository Implementations
    {
      provide: 'IUserRepository',
      useClass: MongoUserRepository,
    },
    {
      provide: 'IChatSessionRepository',
      useClass: MongoChatSessionRepository,
    },

    // Domain Services
    {
      provide: UserDomainService,
      useFactory: (userRepo: IUserRepository) => new UserDomainService(userRepo),
      inject: ['IUserRepository'],
    },
    {
      provide: ChatSessionDomainService,
      useFactory: (sessionRepo: IChatSessionRepository) => new ChatSessionDomainService(sessionRepo),
      inject: ['IChatSessionRepository'],
    },

    // User Use Cases (Solo consultas READ-ONLY de BD UPT)
    // NO hay autenticación aquí, eso lo hace el sistema UPT
    GetUserProfileUseCase,
    ValidateUserForChatUseCase,

    // Chat Session Use Cases
    StartChatSessionUseCase,
    GetActiveChatSessionUseCase,
    EndChatSessionUseCase,
    ValidateSessionTokenUseCase,
    RecordUserMessageUseCase,
    SetSessionSatisfactionUseCase,
    UpdateSessionMetadataUseCase,
    GetSessionAnalyticsUseCase,
    CleanupExpiredSessionsUseCase,

    // Health Check
    HealthCheckUseCase,

    // Auth Strategy
    JwtStrategy,

    // Logger Service
    AppLoggerService,

    // RF004: Password Reset Services
    MySQLConnectionService,
    PasswordResetService,

    // NLP Service
    NlpService,
    
    // Support Service
    SupportService,
    
    // Analytics Service
    AnalyticsService,
    
    // Dialogflow Service
    DialogflowService,
  ],
  exports: [
    MySQLConnectionService, // Para usar en UsersController
  ],
})
export class AppModule {}
