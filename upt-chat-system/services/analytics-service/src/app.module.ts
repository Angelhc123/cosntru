import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsModule } from './application/analytics/analytics.module';

@Module({
  imports: [
    // Cargar variables de entorno desde .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Conexión a MongoDB
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/upt_chat_system',
      {
        dbName: 'BASEDEDATOS2', // Nombre correcto de la base de datos en Atlas
        retryWrites: true,
        w: 'majority',
      },
    ),
    
    // Módulo de tareas programadas
    ScheduleModule.forRoot(),
    
    // Módulo de analytics
    AnalyticsModule,
  ],
})
export class AppModule {}
