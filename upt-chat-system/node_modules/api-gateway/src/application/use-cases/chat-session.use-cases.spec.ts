import { 
  StartChatSessionUseCase, 
  GetActiveChatSessionUseCase, 
  EndChatSessionUseCase,
  ValidateSessionTokenUseCase
} from './chat-session.use-cases';
import { ChatSessionDomainService } from '../../domain/services/chat-session-domain.service';
import { StartChatSessionDto, ChatSessionResponseDto } from '../dtos/chat-session.dto';
import { ChatSession } from '../../domain/entities/chat-session.entity';

describe('Chat Session Use Cases', () => {
  let startChatSessionUseCase: StartChatSessionUseCase;
  let getActiveChatSessionUseCase: GetActiveChatSessionUseCase;
  let endChatSessionUseCase: EndChatSessionUseCase;
  let validateSessionTokenUseCase: ValidateSessionTokenUseCase;
  let mockSessionDomainService: jest.Mocked<ChatSessionDomainService>;

  beforeEach(() => {
    mockSessionDomainService = {
      startNewSession: jest.fn(),
      getActiveSession: jest.fn(),
      endSession: jest.fn(),
      validateSessionToken: jest.fn(),
    } as any;

    startChatSessionUseCase = new StartChatSessionUseCase(mockSessionDomainService);
    getActiveChatSessionUseCase = new GetActiveChatSessionUseCase(mockSessionDomainService);
    endChatSessionUseCase = new EndChatSessionUseCase(mockSessionDomainService);
    validateSessionTokenUseCase = new ValidateSessionTokenUseCase(mockSessionDomainService);
  });

  describe('StartChatSessionUseCase', () => {
    it('should start new chat session', async () => {
      // Arrange
      const userId = 'user123';
      const startSessionDto: StartChatSessionDto = {
        userAgent: 'Mozilla/5.0',
        ipAddress: '192.168.1.1',
        platform: 'web',
        initialQuery: 'Hola, necesito ayuda'
      };

      const mockSession = ChatSession.create({
        id: 'session123',
        userId,
        sessionToken: 'token123'
      });

      mockSessionDomainService.startNewSession.mockResolvedValue(mockSession);

      // Act
      const result = await startChatSessionUseCase.execute(userId, startSessionDto);

      // Assert
      expect(result).toBeDefined();
      expect(mockSessionDomainService.startNewSession).toHaveBeenCalledWith(userId, {
        userAgent: 'Mozilla/5.0',
        ipAddress: '192.168.1.1',
        platform: 'web',
        initialQuery: 'Hola, necesito ayuda',
        totalMessages: 0,
        avgResponseTime: 0
      });
    });
  });

  describe('GetActiveChatSessionUseCase', () => {
    it('should return active session when exists', async () => {
      // Arrange
      const userId = 'user123';
      const mockSession = ChatSession.create({
        id: 'session123',
        userId,
        sessionToken: 'token123'
      });

      mockSessionDomainService.getActiveSession.mockResolvedValue(mockSession);

      // Act
      const result = await getActiveChatSessionUseCase.execute(userId);

      // Assert
      expect(result).toBeDefined();
      expect(mockSessionDomainService.getActiveSession).toHaveBeenCalledWith(userId);
    });

    it('should return null when no active session', async () => {
      // Arrange
      const userId = 'user123';
      mockSessionDomainService.getActiveSession.mockResolvedValue(null);

      // Act
      const result = await getActiveChatSessionUseCase.execute(userId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('EndChatSessionUseCase', () => {
    it('should end session successfully', async () => {
      // Arrange
      const sessionId = 'session123';
      mockSessionDomainService.endSession.mockResolvedValue(true);

      // Act
      const result = await endChatSessionUseCase.execute(sessionId);

      // Assert
      expect(result).toBe(true);
      expect(mockSessionDomainService.endSession).toHaveBeenCalledWith(sessionId);
    });

    it('should return false when session not found', async () => {
      // Arrange
      const sessionId = 'nonexistent';
      mockSessionDomainService.endSession.mockResolvedValue(false);

      // Act
      const result = await endChatSessionUseCase.execute(sessionId);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('ValidateSessionTokenUseCase', () => {
    it('should return session when token is valid', async () => {
      // Arrange
      const token = 'valid-token';
      const mockSession = ChatSession.create({
        id: 'session123',
        userId: 'user123',
        sessionToken: token
      });

      mockSessionDomainService.validateSessionToken.mockResolvedValue(mockSession);

      // Act
      const result = await validateSessionTokenUseCase.execute(token);

      // Assert
      expect(result).toBeDefined();
      expect(mockSessionDomainService.validateSessionToken).toHaveBeenCalledWith(token);
    });

    it('should return null when token is invalid', async () => {
      // Arrange
      const token = 'invalid-token';
      mockSessionDomainService.validateSessionToken.mockResolvedValue(null);

      // Act
      const result = await validateSessionTokenUseCase.execute(token);

      // Assert
      expect(result).toBeNull();
    });
  });
});