import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Mensaje de bienvenida del sistema UPT' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sistema funcionando correctamente' 
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check del API Gateway' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sistema saludable' 
  })
  getHealth(): { 
    status: string; 
    timestamp: string; 
    service: string; 
    version: string; 
    uptime: number; 
  } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'API Gateway UPT Chat System',
      version: '1.0.0',
      uptime: process.uptime()
    };
  }
}
