import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🎓 ¡Bienvenido al Sistema de Agente Interactivo UPT! 🤖\n\n' +
           '📚 Universidad Privada de Tacna\n' +
           '🔗 API Gateway v1.0.0\n' +
           '📖 Documentación: /api/docs\n' +
           '🚀 Estado: Operacional';
  }
}
