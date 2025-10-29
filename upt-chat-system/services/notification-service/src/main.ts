/**
 * Main - Notification Microservice
 * Puerto: 3005
 * Responsabilidad: Envío de notificaciones (emails, SMS, push)
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Habilitar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS - Configuración completa para permitir localhost:8000
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:8000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  const port = process.env.PORT || 3005;
  await app.listen(port);

  logger.log(`🚀 Notification Service corriendo en puerto ${port}`);
  logger.log(`📧 Gmail configurado: ${process.env.GMAIL_USER}`);
  logger.log(`🔗 API Gateway: ${process.env.API_GATEWAY_URL}`);
}

bootstrap();
