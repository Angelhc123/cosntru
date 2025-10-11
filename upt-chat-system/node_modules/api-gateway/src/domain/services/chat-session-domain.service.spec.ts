import { ChatSessionDomainService } from './chat-session-domain.service';
import { IChatSessionRepository } from '../repositories/chat-session.repository.interface';
import { ChatSession } from '../entities/chat-session.entity';

describe('ChatSessionDomainService', () => {
  let service: ChatSessionDomainService;
  let mockSessionRepository: jest.Mocked<IChatSessionRepository>;

  beforeEach(() => {
    mockSessionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findActiveByUserId: jest.fn(),
      findByUserId: jest.fn(),
      findBySessionToken: jest.fn(),
      update: jest.fn(),
      endSession: jest.fn(),
      findActiveSessions: jest.fn(),
      findExpiredSessions: jest.fn(),
      deleteSession: jest.fn(),
      findSessionsByDateRange: jest.fn(),
      countActiveSessionsForUser: jest.fn(),
    } as any;

    service = new ChatSessionDomainService(mockSessionRepository);
  });

  describe('startNewSession', () => {
    it('should create new session when no active session exists', async () => {
      // Arrange
      const userId = 'user123';
      const metadata = {
        userAgent: 'Mozilla/5.0',
        ipAddress: '192.168.1.1',
        platform: 'web'
      };

      mockSessionRepository.findActiveByUserId.mockResolvedValue(null);
      
      const mockNewSession = ChatSession.create({
        id: 'session123',
        userId,
        sessionToken: 'token123',
        metadata
      });
      
      mockSessionRepository.create.mockResolvedValue(mockNewSession);

      // Act
      const result = await service.startNewSession(userId, metadata);

      // Assert
      expect(result).toBe(mockNewSession);
      expect(mockSessionRepository.findActiveByUserId).toHaveBeenCalledWith(userId);
      expect(mockSessionRepository.create).toHaveBeenCalled();
    });
  });

  describe('getActiveSession', () => {
    it('should return active session when exists', async () => {
      // Arrange
      const userId = 'user123';
      const mockSession = ChatSession.create({
        id: 'session123',
        userId,
        sessionToken: 'token123'
      });

      jest.spyOn(mockSession, 'isExpired').mockReturnValue(false);
      mockSessionRepository.findActiveByUserId.mockResolvedValue(mockSession);

      // Act
      const result = await service.getActiveSession(userId);

      // Assert
      expect(result).toBe(mockSession);
      expect(mockSessionRepository.findActiveByUserId).toHaveBeenCalledWith(userId);
    });

    it('should return null when no active session', async () => {
      // Arrange
      const userId = 'user123';
      mockSessionRepository.findActiveByUserId.mockResolvedValue(null);

      // Act
      const result = await service.getActiveSession(userId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('endSession', () => {
    it('should end session successfully', async () => {
      // Arrange
      const sessionId = 'session123';
      const mockSession = ChatSession.create({
        id: sessionId,
        userId: 'user123',
        sessionToken: 'token123'
      });

      mockSessionRepository.findById.mockResolvedValue(mockSession);
      mockSessionRepository.update.mockResolvedValue(mockSession);

      // Act
      const result = await service.endSession(sessionId);

      // Assert
      expect(result).toBe(true);
      expect(mockSessionRepository.findById).toHaveBeenCalledWith(sessionId);
    });

    it('should throw error when session not found', async () => {
      // Arrange
      const sessionId = 'nonexistent';
      mockSessionRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.endSession(sessionId)).rejects.toThrow('Sesión no encontrada');
    });
  });

  describe('validateSessionToken', () => {
    it('should return session when token is valid', async () => {
      // Arrange
      const token = 'valid-token';
      const mockSession = ChatSession.create({
        id: 'session123',
        userId: 'user123',
        sessionToken: token
      });

      jest.spyOn(mockSession, 'isExpired').mockReturnValue(false);
      mockSessionRepository.findBySessionToken.mockResolvedValue(mockSession);

      // Act
      const result = await service.validateSessionToken(token);

      // Assert
      expect(result).toBe(mockSession);
      expect(mockSessionRepository.findBySessionToken).toHaveBeenCalledWith(token);
    });

    it('should return null when token is invalid', async () => {
      // Arrange
      const token = 'invalid-token';
      mockSessionRepository.findBySessionToken.mockResolvedValue(null);

      // Act
      const result = await service.validateSessionToken(token);

      // Assert
      expect(result).toBeNull();
    });
  });
});