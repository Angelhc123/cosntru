import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT Strategy para Passport
 * 
 * Esta estrategia valida el token JWT en cada petición protegida.
 * NO consulta la BD de UPT, solo valida que el token sea válido y no haya expirado.
 * 
 * Flujo:
 * 1. Extrae el token del header Authorization: Bearer <token>
 * 2. Verifica la firma con JWT_SECRET
 * 3. Verifica que no haya expirado
 * 4. Decodifica el payload
 * 5. Llama a validate() con el payload
 * 6. Lo que retorne validate() se inyecta en @CurrentUser()
 */

export interface JwtPayload {
  userId: string;
  email: string;
  userType: string;
  iat?: number; // Issued at
  exp?: number; // Expiration
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret',
    });
  }

  /**
   * Valida el payload del token JWT
   * 
   * Este método se ejecuta DESPUÉS de que Passport verifica:
   * - La firma es válida
   * - El token no ha expirado
   * 
   * Aquí puedes agregar validaciones adicionales:
   * - Verificar que el usuario aún existe en BD
   * - Verificar que el usuario no ha sido bloqueado
   * - Verificar permisos adicionales
   * 
   * @param payload - Datos decodificados del token
   * @returns Objeto que se inyecta en @CurrentUser()
   */
  async validate(payload: JwtPayload) {
    if (!payload.userId || !payload.email) {
      throw new UnauthorizedException('Token inválido: datos incompletos');
    }

    // Validaciones adicionales opcionales:
    // const user = await this.userRepository.findById(payload.userId);
    // if (!user) {
    //   throw new UnauthorizedException('Usuario no encontrado');
    // }
    // if (user.isBlocked) {
    //   throw new UnauthorizedException('Usuario bloqueado');
    // }

    // Lo que retornes aquí estará disponible en @CurrentUser()
    return {
      userId: payload.userId,
      email: payload.email,
      userType: payload.userType,
    };
  }
}
