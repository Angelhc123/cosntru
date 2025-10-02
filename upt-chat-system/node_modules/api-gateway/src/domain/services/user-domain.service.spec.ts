import { UserDomainService } from './user-domain.service';
import { IUserRepository } from '../repositories/user.repository.interface';
import { User, UserType } from '../entities/user.entity';

describe('UserDomainService', () => {
  let service: UserDomainService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      existsByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findActiveUsers: jest.fn(),
      countByUserType: jest.fn(),
    } as any;

    service = new UserDomainService(mockUserRepository);
  });

  describe('authenticateUser', () => {
    it('should return user when authentication succeeds', async () => {
      // Arrange
      const email = 'user@upt.pe';
      const password = 'password123';
      const mockUser = User.create({
        id: '1',
        email,
        firstName: 'Juan',
        lastName: 'Pérez',
        userType: UserType.STUDENT
      });

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      // Act
      const result = await service.authenticateUser(email, password);

      // Assert
      expect(result).toBe(mockUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const email = 'nonexistent@upt.pe';
      const password = 'password123';
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await service.authenticateUser(email, password);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('createNewUser', () => {
    it('should create user when email is available', async () => {
      // Arrange
      const userData = {
        id: '1',
        email: 'new@upt.pe',
        firstName: 'María',
        lastName: 'García',
        userType: UserType.STUDENT
      };

      mockUserRepository.existsByEmail.mockResolvedValue(false);
      const expectedUser = User.create(userData);
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await service.createNewUser(userData);

      // Assert
      expect(result).toBe(expectedUser);
      expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should throw error when email already exists', async () => {
      // Arrange
      const userData = {
        id: '1',
        email: 'existing@upt.pe',
        firstName: 'María',
        lastName: 'García',
        userType: UserType.STUDENT
      };

      mockUserRepository.existsByEmail.mockResolvedValue(true);

      // Act & Assert
      await expect(service.createNewUser(userData)).rejects.toThrow(
        'El email ya está registrado en el sistema'
      );
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile when user exists', async () => {
      // Arrange
      const userId = '1';
      const mockUser = User.create({
        id: userId,
        email: 'user@upt.pe',
        firstName: 'Carlos',
        lastName: 'López',
        userType: UserType.TEACHER
      });

      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await service.getUserProfile(userId);

      // Assert
      expect(result).toBe(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = 'nonexistent';
      mockUserRepository.findById.mockResolvedValue(null);

      // Act
      const result = await service.getUserProfile(userId);

      // Assert
      expect(result).toBeNull();
    });
  });
});