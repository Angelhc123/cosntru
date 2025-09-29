import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import { ThrottlerGuard } from '@nestjs/throttler';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security middlewares
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });

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
    .setDescription('API Gateway para el sistema de agente interactivo con NLP de la Universidad Privada de Tacna')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Users', 'Operaciones relacionadas con usuarios del sistema UPT')
    .addTag('Chat Sessions', 'Operaciones relacionadas con sesiones de chat')
    .addServer('http://localhost:3000', 'Desarrollo')
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

  logger.log(`🚀 API Gateway ejecutándose en: http://localhost:${port}`);
  logger.log(`📚 Documentación disponible en: http://localhost:${port}/api/docs`);
  logger.log(`🎯 Entorno: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((error) => {
  console.error('Error al iniciar la aplicación:', error);
  process.exit(1);
});
