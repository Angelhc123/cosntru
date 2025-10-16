import { Controller, Get } from '@nestjs/common';

@Controller('api/config')
export class ConfigController {
  @Get('widget')
  getWidgetConfig() {
    return {
      theme: 'upt',
      categories: [
        'Información Académica',
        'Soporte Técnico',
        'Trámites Administrativos',
        'Consultas Generales'
      ],
      status: 'online',
      welcomeMessage: '¡Hola! Soy el asistente virtual de la UPT. ¿En qué puedo ayudarte hoy?',
      interfaz: {
        colorPrimario: '#1e40af',
        colorSecundario: '#3b82f6',
        logoUrl: '/assets/images/upt-logo.png'
      },
      estadoOperativo: 'activo'
    };
  }
}