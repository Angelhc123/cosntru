import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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

// Auth
import { JwtStrategy } from './infrastructure/auth/strategies/jwt.strategy';
import { AppLoggerService } from './infrastructure/logging/logger.service';
import { HealthCheckUseCase } from './application/use-cases/health.use-cases';

// Infrastructure
import { MongoUserRepository } from './infrastructure/database/repositories/mongo-user.repository';
import { MongoChatSessionRepository } from './infrastructure/database/repositories/mongo-chat-session.repository';
import { UserDocument, UserSchema } from './infrastructure/database/schemas/user.schema';
import { ChatSessionDocument, ChatSessionSchema } from './infrastructure/database/schemas/chat-session.schema';

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
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/upt_chat_system'),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'ChatSession', schema: ChatSessionSchema }
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
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      },
    }),

    // Winston Logger
    WinstonModule.forRoot(winstonConfig),
  ],
  
  controllers: [
    AppController,
    UsersController,
    ChatSessionsController,
    HealthController,
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
  ],
})
export class AppModule {}
