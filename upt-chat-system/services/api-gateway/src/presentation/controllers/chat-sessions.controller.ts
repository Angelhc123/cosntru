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
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MessageDocument } from '../../infrastructure/database/schemas/message.schema';
import { ChatSessionDocument } from '../../infrastructure/database/schemas/chat-session.schema';
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
    private readonly cleanupExpiredSessionsUseCase: CleanupExpiredSessionsUseCase,
    @InjectModel('Message') private readonly messageModel: Model<MessageDocument>,
    @InjectModel('ChatSession') private readonly chatSessionModel: Model<ChatSessionDocument>
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

  @Get('history/:userId')
  @ApiOperation({ summary: 'Obtener historial de conversaciones del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Historial de conversaciones obtenido exitosamente' 
  })
  async getUserHistory(@Param('userId') userId: string): Promise<{
    status: string;
    message: string;
    data: any[];
  }> {
    try {
      // Obtener solo las sesiones ACTIVAS del usuario (isActive: true)
      const sessions = await this.chatSessionModel.find({ 
        userId,
        isActive: true  // ✅ SOLO conversaciones activas (no finalizadas)
      })
        .sort({ startedAt: -1 }) // Más recientes primero
        .limit(20) // Últimas 20 conversaciones
        .select('sessionId startedAt endedAt isActive metadata')
        .lean();

      console.log(`📊 Historial de usuario ${userId}: ${sessions.length} conversaciones activas`);

      // Formatear las conversaciones
      const formattedSessions = sessions.map((session: any, index: number) => {
        const sessionNumber = sessions.length - index;
        const date = new Date(session.startedAt);
        const dateStr = date.toLocaleDateString('es-PE', { 
          day: '2-digit', 
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        return {
          sessionId: session._id.toString(),  // ✅ CORRECCIÓN: Usar _id no sessionId
          title: `Conversación ${sessionNumber}`,
          date: dateStr,
          isActive: session.isActive,
          startedAt: session.startedAt,
          endedAt: session.endedAt
        };
      });

      return {
        status: 'success',
        message: 'Historial obtenido exitosamente',
        data: formattedSessions
      };
    } catch (error) {
      console.error('❌ Error obteniendo historial:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Error al obtener historial de conversaciones',
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
    @Body() messageData: { text: string; sender: string; responseTime?: number; metadata?: any }
  ): Promise<{
    status: string;
    message: string;
    data: any;
  }> {
    try {
      const result = await this.recordUserMessageUseCase.execute(
        sessionId, 
        messageData.text,
        messageData.sender,
        messageData.responseTime,
        messageData.metadata
      );
      
      return {
        status: 'success',
        message: 'Mensaje registrado exitosamente',
        data: result
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

  @Get(':sessionId/messages')
  @ApiOperation({ summary: 'Obtener mensajes de una sesión' })
  @ApiResponse({ 
    status: 200, 
    description: 'Mensajes obtenidos exitosamente' 
  })
  async getSessionMessages(@Param('sessionId') sessionId: string): Promise<{
    status: string;
    message: string;
    data: any[];
  }> {
    try {
      console.log('🔍 Buscando mensajes para sessionId:', sessionId);
      
      // ✅ VALIDACIÓN CRÍTICA: Verificar que la sesión existe y obtener su userId
      const session = await this.chatSessionModel
        .findById(sessionId)
        .select('userId')
        .lean();
      
      if (!session) {
        console.warn('⚠️  Sesión no encontrada:', sessionId);
        return {
          status: 'success',
          message: 'Sesión no encontrada',
          data: []
        };
      }
      
      console.log('✅ Sesión encontrada con userId:', session.userId);
      
      // ✅ Filtrar SOLO por sessionId (es suficiente para seguridad)
      const messages = await this.messageModel
        .find({ sessionId })
        .sort({ timestamp: 1 })
        .select('sender text timestamp metadata userId')
        .lean();
      
      console.log(`📨 Encontrados ${messages.length} mensajes para session ${sessionId}`);
      
      return {
        status: 'success',
        message: 'Mensajes obtenidos exitosamente',
        data: messages
      };
    } catch (error) {
      console.error('❌ Error obteniendo mensajes:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Error al obtener mensajes',
          errorCode: 'GET_MESSAGES_ERROR'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
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

  @Post('cleanup-undefined')
  @ApiOperation({ summary: '🧹 Limpiar datos basura con sessionId "undefined"' })
  @ApiResponse({ 
    status: 200, 
    description: 'Datos basura eliminados exitosamente' 
  })
  async cleanupUndefinedData(): Promise<{
    status: string;
    message: string;
    data: {
      messagesDeleted: number;
      sessionsDeleted: number;
    };
  }> {
    try {
      console.log('🧹 Iniciando limpieza de datos basura con sessionId "undefined"...');
      
      // Eliminar mensajes con sessionId "undefined"
      const messagesResult = await this.messageModel.deleteMany({ 
        sessionId: 'undefined' 
      });
      console.log(`✅ Mensajes eliminados: ${messagesResult.deletedCount}`);
      
      // Eliminar sesiones con _id "undefined"
      const sessionsResult = await this.chatSessionModel.deleteMany({ 
        _id: 'undefined' 
      });
      console.log(`✅ Sesiones eliminadas: ${sessionsResult.deletedCount}`);
      
      return {
        status: 'success',
        message: 'Datos basura eliminados exitosamente',
        data: {
          messagesDeleted: messagesResult.deletedCount,
          sessionsDeleted: sessionsResult.deletedCount
        }
      };
    } catch (error) {
      console.error('❌ Error limpiando datos basura:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Error al limpiar datos basura',
          errorCode: 'CLEANUP_ERROR'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':sessionId/message/:messageId/feedback')
  @ApiOperation({ summary: 'Enviar feedback para un mensaje' })
  @ApiResponse({ status: 200, description: 'Feedback registrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Mensaje no encontrado' })
  async sendMessageFeedback(
    @Param('sessionId') sessionId: string,
    @Param('messageId') messageId: string,
    @Body() body: { feedback: 'positive' | 'negative' }
  ): Promise<{
    status: string;
    message: string;
    data?: any;
  }> {
    try {
      const { feedback } = body;

      // Validar que el feedback sea válido
      if (!['positive', 'negative'].includes(feedback)) {
        throw new HttpException(
          'Feedback debe ser "positive" o "negative"',
          HttpStatus.BAD_REQUEST
        );
      }

      // Actualizar el mensaje con el feedback
      const updatedMessage = await this.messageModel.findOneAndUpdate(
        { 
          _id: messageId,
          sessionId: sessionId,
          sender: 'bot' // Solo mensajes del bot pueden recibir feedback
        },
        {
          feedback: feedback,
          feedbackTimestamp: new Date()
        },
        { new: true }
      );

      if (!updatedMessage) {
        throw new HttpException(
          'Mensaje no encontrado o no es un mensaje del bot',
          HttpStatus.NOT_FOUND
        );
      }

      console.log(`📝 Feedback "${feedback}" registrado para mensaje ${messageId}`);

      return {
        status: 'success',
        message: 'Feedback registrado exitosamente',
        data: {
          messageId: messageId,
          feedback: feedback,
          timestamp: updatedMessage.feedbackTimestamp
        }
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('❌ Error registrando feedback:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Error al registrar feedback',
          errorCode: 'FEEDBACK_ERROR'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}