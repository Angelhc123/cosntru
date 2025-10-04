import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * JWT Authentication Guard
 * 
 * Protege endpoints que requieren autenticación.
 * 
 * Uso en controladores:
 * @UseGuards(JwtAuthGuard)
 * @Get('/protected-endpoint')
 * async protectedRoute(@CurrentUser() user) {
 *   // user contiene: { userId, email, userType }
 * }
 * 
 * Funcionamiento:
 * 1. Intercepta la petición antes de llegar al controlador
 * 2. Extrae el token del header Authorization
 * 3. Llama a JwtStrategy.validate()
 * 4. Si es válido, permite continuar
 * 5. Si no es válido, lanza UnauthorizedException
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Puedes agregar lógica adicional aquí antes de la validación JWT
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Manejo personalizado de errores
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado. Por favor, inicia sesión nuevamente.');
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido.');
      }
      if (info?.message === 'No auth token') {
        throw new UnauthorizedException('Token no proporcionado. Header requerido: Authorization: Bearer <token>');
      }
      throw err || new UnauthorizedException('No autorizado');
    }
    return user;
  }
}
