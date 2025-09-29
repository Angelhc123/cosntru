"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:4200'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
    });
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
        .setDescription('API Gateway para el sistema de agente interactivo con NLP de la Universidad Privada de Tacna')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Users', 'Operaciones relacionadas con usuarios del sistema UPT')
        .addTag('Chat Sessions', 'Operaciones relacionadas con sesiones de chat')
        .addServer('http://localhost:3000', 'Desarrollo')
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
    logger.log(`🚀 API Gateway ejecutándose en: http://localhost:${port}`);
    logger.log(`📚 Documentación disponible en: http://localhost:${port}/api/docs`);
    logger.log(`🎯 Entorno: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap().catch((error) => {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map