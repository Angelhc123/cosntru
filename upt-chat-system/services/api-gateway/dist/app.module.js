"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const nest_winston_1 = require("nest-winston");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const winston_config_1 = require("./infrastructure/logging/winston.config");
const user_domain_service_1 = require("./domain/services/user-domain.service");
const chat_session_domain_service_1 = require("./domain/services/chat-session-domain.service");
const user_use_cases_1 = require("./application/use-cases/user.use-cases");
const chat_session_use_cases_1 = require("./application/use-cases/chat-session.use-cases");
const users_controller_1 = require("./presentation/controllers/users.controller");
const chat_sessions_controller_1 = require("./presentation/controllers/chat-sessions.controller");
const health_controller_1 = require("./presentation/controllers/health.controller");
const jwt_strategy_1 = require("./infrastructure/auth/strategies/jwt.strategy");
const logger_service_1 = require("./infrastructure/logging/logger.service");
const health_use_cases_1 = require("./application/use-cases/health.use-cases");
const mongo_user_repository_1 = require("./infrastructure/database/repositories/mongo-user.repository");
const mongo_chat_session_repository_1 = require("./infrastructure/database/repositories/mongo-chat-session.repository");
const user_schema_1 = require("./infrastructure/database/schemas/user.schema");
const chat_session_schema_1 = require("./infrastructure/database/schemas/chat-session.schema");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/upt_chat_system'),
            mongoose_1.MongooseModule.forFeature([
                { name: 'User', schema: user_schema_1.UserSchema },
                { name: 'ChatSession', schema: chat_session_schema_1.ChatSessionSchema }
            ]),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
                    limit: parseInt(process.env.RATE_LIMIT_MAX || '100'),
                }]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
                signOptions: {
                    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
                },
            }),
            nest_winston_1.WinstonModule.forRoot(winston_config_1.winstonConfig),
        ],
        controllers: [
            app_controller_1.AppController,
            users_controller_1.UsersController,
            chat_sessions_controller_1.ChatSessionsController,
            health_controller_1.HealthController,
        ],
        providers: [
            app_service_1.AppService,
            {
                provide: 'IUserRepository',
                useClass: mongo_user_repository_1.MongoUserRepository,
            },
            {
                provide: 'IChatSessionRepository',
                useClass: mongo_chat_session_repository_1.MongoChatSessionRepository,
            },
            {
                provide: user_domain_service_1.UserDomainService,
                useFactory: (userRepo) => new user_domain_service_1.UserDomainService(userRepo),
                inject: ['IUserRepository'],
            },
            {
                provide: chat_session_domain_service_1.ChatSessionDomainService,
                useFactory: (sessionRepo) => new chat_session_domain_service_1.ChatSessionDomainService(sessionRepo),
                inject: ['IChatSessionRepository'],
            },
            user_use_cases_1.GetUserProfileUseCase,
            user_use_cases_1.ValidateUserForChatUseCase,
            chat_session_use_cases_1.StartChatSessionUseCase,
            chat_session_use_cases_1.GetActiveChatSessionUseCase,
            chat_session_use_cases_1.EndChatSessionUseCase,
            chat_session_use_cases_1.ValidateSessionTokenUseCase,
            chat_session_use_cases_1.RecordUserMessageUseCase,
            chat_session_use_cases_1.SetSessionSatisfactionUseCase,
            chat_session_use_cases_1.UpdateSessionMetadataUseCase,
            chat_session_use_cases_1.GetSessionAnalyticsUseCase,
            chat_session_use_cases_1.CleanupExpiredSessionsUseCase,
            health_use_cases_1.HealthCheckUseCase,
            jwt_strategy_1.JwtStrategy,
            logger_service_1.AppLoggerService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map