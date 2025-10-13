/**
 * App Module - Notification Microservice
 * Microservicio independiente para notificaciones
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './application/services/email.service';
import { NotificationController } from './infrastructure/controllers/notification.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [NotificationController],
  providers: [EmailService],
})
export class AppModule {}
