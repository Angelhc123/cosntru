import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  HttpStatus, 
  HttpException,
  UseGuards,
  Req
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { 
  CreateUserUseCase, 
  AuthenticateUserUseCase, 
  GetUserProfileUseCase,
  ValidateUserForChatUseCase,
  GetUsersByTypeUseCase
} from '../../application/use-cases/user.use-cases';
import { CreateUserDto, LoginUserDto, UserResponseDto } from '../../application/dtos/user.dto';
import { UserType } from '../../domain/entities/user.entity';

/**
 * Controller: Users
 * Maneja las operaciones HTTP relacionadas con usuarios del sistema UPT
 */
@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly validateUserForChatUseCase: ValidateUserForChatUseCase,
    private readonly getUsersByTypeUseCase: GetUsersByTypeUseCase
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario en el sistema UPT' })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'El email ya está registrado' 
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<{
    status: string;
    message: string;
    data: UserResponseDto;
  }> {
    try {
      const user = await this.createUserUseCase.execute(createUserDto);
      
      return {
        status: 'success',
        message: 'Usuario registrado exitosamente',
        data: user
      };
    } catch (error) {
      if (error.message.includes('ya está registrado')) {
        throw new HttpException(
          {
            status: 'error',
            message: error.message,
            errorCode: 'EMAIL_ALREADY_EXISTS'
          },
          HttpStatus.CONFLICT
        );
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
          errorCode: 'VALIDATION_ERROR'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuario en el sistema' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario autenticado exitosamente' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas' 
  })
  async login(@Body() loginDto: LoginUserDto): Promise<{
    status: string;
    message: string;
    data?: {
      user: UserResponseDto;
      token: string;
    };
  }> {
    try {
      const result = await this.authenticateUserUseCase.execute(loginDto);
      
      if (!result) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Credenciales inválidas',
            errorCode: 'INVALID_CREDENTIALS'
          },
          HttpStatus.UNAUTHORIZED
        );
      }

      return {
        status: 'success',
        message: 'Usuario autenticado exitosamente',
        data: result
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Error interno del servidor',
          errorCode: 'INTERNAL_ERROR'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('profile/:id')
  @ApiOperation({ summary: 'Obtener perfil de usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil obtenido exitosamente',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  async getProfile(@Param('id') userId: string): Promise<{
    status: string;
    message: string;
    data?: UserResponseDto;
  }> {
    try {
      const user = await this.getUserProfileUseCase.execute(userId);
      
      if (!user) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Usuario no encontrado',
            errorCode: 'USER_NOT_FOUND'
          },
          HttpStatus.NOT_FOUND
        );
      }

      return {
        status: 'success',
        message: 'Perfil obtenido exitosamente',
        data: user
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          status: 'error',
          message: 'Error interno del servidor',
          errorCode: 'INTERNAL_ERROR'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('validate-for-chat/:id')
  @ApiOperation({ summary: 'Validar si usuario puede usar el chat' })
  @ApiResponse({ 
    status: 200, 
    description: 'Validación completada' 
  })
  async validateForChat(@Param('id') userId: string): Promise<{
    status: string;
    message: string;
    data: {
      canChat: boolean;
    };
  }> {
    try {
      const canChat = await this.validateUserForChatUseCase.execute(userId);
      
      return {
        status: 'success',
        message: 'Validación completada',
        data: { canChat }
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Error interno del servidor',
          errorCode: 'INTERNAL_ERROR'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('by-type/:type')
  @ApiOperation({ summary: 'Obtener usuarios por tipo' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuarios obtenidos exitosamente' 
  })
  async getUsersByType(@Param('type') userType: UserType): Promise<{
    status: string;
    message: string;
    data: {
      users: UserResponseDto[];
      count: number;
    };
  }> {
    try {
      const users = await this.getUsersByTypeUseCase.execute(userType);
      
      return {
        status: 'success',
        message: 'Usuarios obtenidos exitosamente',
        data: {
          users,
          count: users.length
        }
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Error interno del servidor',
          errorCode: 'INTERNAL_ERROR'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}