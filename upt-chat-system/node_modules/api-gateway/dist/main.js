"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const nest_winston_1 = require("nest-winston");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const http_exception_filter_1 = require("./infrastructure/filters/http-exception.filter");
const all_exceptions_filter_1 = require("./infrastructure/filters/all-exceptions.filter");
const logger_service_1 = require("./infrastructure/logging/logger.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    const winstonLogger = app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER);
    app.useLogger(winstonLogger);
    const appLogger = app.get(logger_service_1.AppLoggerService);
    appLogger.setContext('Bootstrap');
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || [
            'http://localhost:3000',
            'http://localhost:4200',
            'http://localhost:8000',
            'http://localhost:8002'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
    });
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(appLogger), new http_exception_filter_1.HttpExceptionFilter(appLogger));
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('UPT Chat System API Gateway')
        .setDescription('API Gateway para el sistema de agente interactivo con NLP de la Universidad Privada de Tacna.\n\n' +
        '**Autenticación:** Los usuarios se autentican contra el sistema UPT. Una vez autenticados, reciben un JWT token que debe enviarse en el header `Authorization: Bearer <token>` para acceder a endpoints protegidos.\n\n' +
        '**Flujo:**\n' +
        '1. POST /api/v1/users/login - Obtener JWT token\n' +
        '2. Usar token en header para endpoints protegidos\n' +
        '3. Token válido por 7 días')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingresa tu JWT token (sin el prefijo Bearer)',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Health', 'Verificación de estado del sistema')
        .addTag('Users', 'Autenticación y gestión de usuarios UPT')
        .addTag('Chat Sessions', 'Gestión de sesiones de conversación')
        .addServer('http://localhost:3000', 'Desarrollo Local')
        .addServer('https://api-gateway-production.up.railway.app', 'Producción')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'UPT Chat System API',
        customfavIcon: 'https://upt.edu.pe/favicon.ico',
        customCss: `
      .topbar-wrapper { content: url(https://upt.edu.pe/logo.png); width: 120px; height: auto; }
      .swagger-ui .topbar { background-color: #1f4788; }
    `,
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    appLogger.log(`🚀 API Gateway ejecutándose en: http://localhost:${port}`);
    appLogger.log(`📚 Documentación disponible en: http://localhost:${port}/api/docs`);
    appLogger.log(`🏥 Health check disponible en: http://localhost:${port}/api/v1/health`);
    appLogger.log(`🎯 Entorno: ${process.env.NODE_ENV || 'development'}`);
    appLogger.log(`🔐 JWT expiración: ${process.env.JWT_EXPIRES_IN || '7d'}`);
}
bootstrap().catch((error) => {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map