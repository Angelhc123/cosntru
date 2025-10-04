import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Current User Decorator
 * 
 * Extrae el usuario autenticado del request.
 * Debe usarse en conjunto con @UseGuards(JwtAuthGuard)
 * 
 * Uso:
 * @Get('/profile')
 * @UseGuards(JwtAuthGuard)
 * async getProfile(@CurrentUser() user: CurrentUserDto) {
 *   console.log(user.userId);  // ID del usuario
 *   console.log(user.email);   // Email del usuario
 *   console.log(user.userType); // Tipo de usuario
 * }
 * 
 * También puedes extraer solo un campo:
 * @Get('/my-data')
 * @UseGuards(JwtAuthGuard)
 * async getMyData(@CurrentUser('userId') userId: string) {
 *   return this.service.getData(userId);
 * }
 */

export interface CurrentUserDto {
  userId: string;
  email: string;
  userType: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserDto | undefined, ctx: ExecutionContext): CurrentUserDto | string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Si se especifica un campo, retorna solo ese campo
    if (data) {
      return user?.[data];
    }

    // Retorna el usuario completo
    return user;
  },
);
