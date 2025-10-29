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
const password_reset_controller_1 = require("./infrastructure/controllers/password-reset.controller");
const nlp_controller_1 = require("./presentation/controllers/nlp.controller");
const config_controller_1 = require("./presentation/controllers/config.controller");
const faqs_controller_1 = require("./presentation/controllers/faqs.controller");
const support_controller_1 = require("./presentation/controllers/support.controller");
const analytics_controller_1 = require("./presentation/controllers/analytics.controller");
const dialogflow_controller_1 = require("./presentation/controllers/dialogflow.controller");
const jwt_strategy_1 = require("./infrastructure/auth/strategies/jwt.strategy");
const logger_service_1 = require("./infrastructure/logging/logger.service");
const health_use_cases_1 = require("./application/use-cases/health.use-cases");
const mongo_user_repository_1 = require("./infrastructure/database/repositories/mongo-user.repository");
const mongo_chat_session_repository_1 = require("./infrastructure/database/repositories/mongo-chat-session.repository");
const user_schema_1 = require("./infrastructure/database/schemas/user.schema");
const chat_session_schema_1 = require("./infrastructure/database/schemas/chat-session.schema");
const message_schema_1 = require("./infrastructure/database/schemas/message.schema");
const faq_schema_1 = require("./infrastructure/database/schemas/faq.schema");
const ticket_schema_1 = require("./infrastructure/database/schemas/ticket.schema");
const ticket_message_schema_1 = require("./infrastructure/database/schemas/ticket-message.schema");
const analytics_schema_1 = require("./infrastructure/database/schemas/analytics.schema");
const mysql_connection_service_1 = require("./infrastructure/services/mysql-connection.service");
const password_reset_service_1 = require("./application/services/password-reset.service");
const nlp_service_1 = require("./application/services/nlp.service");
const support_service_1 = require("./application/services/support.service");
const analytics_service_1 = require("./application/services/analytics.service");
const dialogflow_service_1 = require("./application/services/dialogflow.service");
const tickets_module_1 = require("./application/tickets/tickets.module");
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
                { name: 'ChatSession', schema: chat_session_schema_1.ChatSessionSchema },
                { name: 'Message', schema: message_schema_1.MessageSchema },
                { name: 'Faq', schema: faq_schema_1.FaqSchema },
                { name: 'Ticket', schema: ticket_schema_1.TicketSchema },
                { name: 'TicketMessage', schema: ticket_message_schema_1.TicketMessageSchema },
                { name: 'Analytics', schema: analytics_schema_1.AnalyticsSchema },
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
            tickets_module_1.TicketsModule,
        ],
        controllers: [
            app_controller_1.AppController,
            users_controller_1.UsersController,
            chat_sessions_controller_1.ChatSessionsController,
            health_controller_1.HealthController,
            password_reset_controller_1.PasswordResetController,
            nlp_controller_1.NlpController,
            config_controller_1.ConfigController,
            faqs_controller_1.FaqsController,
            support_controller_1.SupportController,
            analytics_controller_1.AnalyticsController,
            dialogflow_controller_1.DialogflowController,
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
            mysql_connection_service_1.MySQLConnectionService,
            password_reset_service_1.PasswordResetService,
            nlp_service_1.NlpService,
            support_service_1.SupportService,
            analytics_service_1.AnalyticsService,
            dialogflow_service_1.DialogflowService,
        ],
        exports: [
            mysql_connection_service_1.MySQLConnectionService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map