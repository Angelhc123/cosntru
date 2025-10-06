import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import compression from 'compression';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { AllExceptionsFilter } from './infrastructure/filters/all-exceptions.filter';
import { AppLoggerService } from './infrastructure/logging/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Configurar Winston como logger principal
  const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(winstonLogger);

  // Logger personalizado para bootstrap
  const appLogger = app.get(AppLoggerService);
  appLogger.setContext('Bootstrap');

  // Security middlewares
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000', 
      'http://localhost:4200',
      'http://localhost:8000',  // Proyecto PHP test
      'http://localhost:8002'   // Proyecto PHP test (puerto alternativo)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });

  // Global exception filters (orden importa: más específico primero)
  app.useGlobalFilters(
    new AllExceptionsFilter(appLogger),
    new HttpExceptionFilter(appLogger),
  );

  // Global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix for API
  app.setGlobalPrefix('api/v1');

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('UPT Chat System API Gateway')
    .setDescription(
      'API Gateway para el sistema de agente interactivo con NLP de la Universidad Privada de Tacna.\n\n' +
      '**Autenticación:** Los usuarios se autentican contra el sistema UPT. Una vez autenticados, reciben un JWT token que debe enviarse en el header `Authorization: Bearer <token>` para acceder a endpoints protegidos.\n\n' +
      '**Flujo:**\n' +
      '1. POST /api/v1/users/login - Obtener JWT token\n' +
      '2. Usar token en header para endpoints protegidos\n' +
      '3. Token válido por 7 días'
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingresa tu JWT token (sin el prefijo Bearer)',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Health', 'Verificación de estado del sistema')
    .addTag('Users', 'Autenticación y gestión de usuarios UPT')
    .addTag('Chat Sessions', 'Gestión de sesiones de conversación')
    .addServer('http://localhost:3000', 'Desarrollo Local')
    .addServer('https://api-gateway-production.up.railway.app', 'Producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
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
