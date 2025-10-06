import { 
  Controller, 
  Post, 
  Get, 
  Put,
  Param, 
  Body,
  Query,
  HttpStatus, 
  HttpException,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { 
  StartChatSessionUseCase,
  GetActiveChatSessionUseCase,
  EndChatSessionUseCase,
  ValidateSessionTokenUseCase,
  RecordUserMessageUseCase,
  SetSessionSatisfactionUseCase,
  UpdateSessionMetadataUseCase,
  GetSessionAnalyticsUseCase,
  CleanupExpiredSessionsUseCase
} from '../../application/use-cases/chat-session.use-cases';
import { 
  StartChatSessionDto,
  ChatSessionResponseDto,
  UpdateSessionMetadataDto,
  SessionSatisfactionDto
} from '../../application/dtos/chat-session.dto';

/**
 * Controller: Chat Sessions
 * Maneja las operaciones HTTP relacionadas con sesiones de chat del sistema UPT
 */
@ApiTags('Chat Sessions')
@Controller('chat-sessions')
export class ChatSessionsController {
  constructor(
    private readonly startChatSessionUseCase: StartChatSessionUseCase,
    private readonly getActiveChatSessionUseCase: GetActiveChatSessionUseCase,
    private readonly endChatSessionUseCase: EndChatSessionUseCase,
    private readonly validateSessionTokenUseCase: ValidateSessionTokenUseCase,
    private readonly recordUserMessageUseCase: RecordUserMessageUseCase,
    private readonly setSessionSatisfactionUseCase: SetSessionSatisfactionUseCase,
    private readonly updateSessionMetadataUseCase: UpdateSessionMetadataUseCase,
    private readonly getSessionAnalyticsUseCase: GetSessionAnalyticsUseCase,
    private readonly cleanupExpiredSessionsUseCase: CleanupExpiredSessionsUseCase
  ) {}

  @Post('start/:userId')
  @ApiOperation({ summary: 'Iniciar nueva sesión de chat para usuario UPT' })
  @ApiResponse({ 
    status: 201, 
    description: 'Sesión de chat iniciada exitosamente',
    type: ChatSessionResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  async startSession(
    @Param('userId') userId: string,
    @Body() startSessionDto: StartChatSessionDto
  ): Promise<{
    status: string;
    message: string;
    data: ChatSessionResponseDto;
  }> {
    try {
      const session = await this.startChatSessionUseCase.execute(userId, startSessionDto);
      
      return {
        status: 'success',
        message: 'Sesión de chat iniciada exitosamente',
        data: session
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
          errorCode: 'SESSION_START_ERROR'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('active/:userId')
  @ApiOperation({ summary: 'Obtener sesión activa del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sesión activa obtenida exitosamente',
    type: ChatSessionResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'No hay sesión activa para el usuario' 
  })
  async getActiveSession(@Param('userId') userId: string): Promise<{
    status: string;
    message: string;
    data?: ChatSessionResponseDto;
  }> {
    try {
      const session = await this.getActiveChatSessionUseCase.execute(userId);
      
      if (!session) {
        return {
          status: 'success',
          message: 'No hay sesión activa para el usuario',
          data: undefined
        };
      }

      return {
        status: 'success',
        message: 'Sesión activa obtenida exitosamente',
        data: session
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

  @Put('end/:sessionId')
  @ApiOperation({ summary: 'Finalizar sesión de chat' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sesión finalizada exitosamente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Sesión no encontrada' 
  })
  async endSession(@Param('sessionId') sessionId: string): Promise<{
    status: string;
    message: string;
    data: {
      ended: boolean;
    };
  }> {
    try {
      const ended = await this.endChatSessionUseCase.execute(sessionId);
      
      return {
        status: 'success',
        message: 'Sesión finalizada exitosamente',
        data: { ended }
      };
    } catch (error) {
      if (error.message.includes('no encontrada')) {
        throw new HttpException(
          {
            status: 'error',
            message: error.message,
            errorCode: 'SESSION_NOT_FOUND'
          },
          HttpStatus.NOT_FOUND
        );
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

  @Get('validate')
  @ApiOperation({ summary: 'Validar token de sesión' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token validado exitosamente' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token inválido o expirado' 
  })
  async validateToken(@Query('token') token: string): Promise<{
    status: string;
    message: string;
    data?: {
      session: ChatSessionResponseDto;
      valid: boolean;
    };
  }> {
    try {
      const session = await this.validateSessionTokenUseCase.execute(token);
      
      if (!session) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Token inválido o expirado',
            errorCode: 'INVALID_TOKEN'
          },
          HttpStatus.UNAUTHORIZED
        );
      }

      return {
        status: 'success',
        message: 'Token validado exitosamente',
        data: {
          session,
          valid: true
        }
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

  @Post(':sessionId/message')
  @ApiOperation({ summary: 'Registrar mensaje del usuario en la sesión' })
  @ApiResponse({ 
    status: 200, 
    description: 'Mensaje registrado exitosamente' 
  })
  async recordMessage(
    @Param('sessionId') sessionId: string,
    @Body() messageData: { responseTime: number }
  ): Promise<{
    status: string;
    message: string;
  }> {
    try {
      await this.recordUserMessageUseCase.execute(sessionId, messageData.responseTime);
      
      return {
        status: 'success',
        message: 'Mensaje registrado exitosamente'
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
          errorCode: 'MESSAGE_RECORD_ERROR'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put(':sessionId/satisfaction')
  @ApiOperation({ summary: 'Establecer puntuación de satisfacción' })
  @ApiResponse({ 
    status: 200, 
    description: 'Puntuación establecida exitosamente' 
  })
  async setSatisfaction(
    @Param('sessionId') sessionId: string,
    @Body() satisfactionDto: SessionSatisfactionDto
  ): Promise<{
    status: string;
    message: string;
  }> {
    try {
      await this.setSessionSatisfactionUseCase.execute(sessionId, satisfactionDto);
      
      return {
        status: 'success',
        message: 'Puntuación de satisfacción establecida exitosamente'
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
          errorCode: 'SATISFACTION_ERROR'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put(':sessionId/metadata')
  @ApiOperation({ summary: 'Actualizar metadatos de la sesión' })
  @ApiResponse({ 
    status: 200, 
    description: 'Metadatos actualizados exitosamente' 
  })
  async updateMetadata(
    @Param('sessionId') sessionId: string,
    @Body() updateDto: UpdateSessionMetadataDto
  ): Promise<{
    status: string;
    message: string;
    data: ChatSessionResponseDto;
  }> {
    try {
      const session = await this.updateSessionMetadataUseCase.execute(sessionId, updateDto);
      
      return {
        status: 'success',
        message: 'Metadatos actualizados exitosamente',
        data: session
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
          errorCode: 'METADATA_UPDATE_ERROR'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Obtener analíticas de sesiones' })
  @ApiResponse({ 
    status: 200, 
    description: 'Analíticas obtenidas exitosamente' 
  })
  async getAnalytics(@Query('userId') userId?: string): Promise<{
    status: string;
    message: string;
    data: any;
  }> {
    try {
      const analytics = await this.getSessionAnalyticsUseCase.execute(userId);
      
      return {
        status: 'success',
        message: 'Analíticas obtenidas exitosamente',
        data: analytics
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

  @Post('cleanup')
  @ApiOperation({ summary: 'Limpiar sesiones expiradas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sesiones expiradas limpiadas exitosamente' 
  })
  async cleanupSessions(): Promise<{
    status: string;
    message: string;
    data: {
      cleanedSessions: number;
    };
  }> {
    try {
      const result = await this.cleanupExpiredSessionsUseCase.execute();
      
      return {
        status: 'success',
        message: 'Sesiones expiradas limpiadas exitosamente',
        data: result
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