import { CreateUserUseCase, AuthenticateUserUseCase, GetUserProfileUseCase } from './user.use-cases';
import { UserDomainService } from '../../domain/services/user-domain.service';
import { CreateUserDto, LoginUserDto, UserResponseDto } from '../dtos/user.dto';
import { User, UserType } from '../../domain/entities/user.entity';

describe('User Use Cases', () => {
  let createUserUseCase: CreateUserUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let getUserProfileUseCase: GetUserProfileUseCase;
  let mockUserDomainService: jest.Mocked<UserDomainService>;

  beforeEach(() => {
    mockUserDomainService = {
      createNewUser: jest.fn(),
      authenticateUser: jest.fn(),
      getUserProfile: jest.fn(),
    } as any;

    createUserUseCase = new CreateUserUseCase(mockUserDomainService);
    authenticateUserUseCase = new AuthenticateUserUseCase(mockUserDomainService);
    getUserProfileUseCase = new GetUserProfileUseCase(mockUserDomainService);
  });

  describe('CreateUserUseCase', () => {
    it('should create user successfully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'student@upt.pe',
        firstName: 'Juan',
        lastName: 'Pérez',
        userType: UserType.STUDENT
      };

      const mockUser = User.create({
        id: 'user123',
        email: 'student@upt.pe',
        firstName: 'Juan',
        lastName: 'Pérez',
        userType: UserType.STUDENT
      });

      mockUserDomainService.createNewUser.mockResolvedValue(mockUser);

      // Act
      const result = await createUserUseCase.execute(createUserDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe('student@upt.pe');
      expect(mockUserDomainService.createNewUser).toHaveBeenCalled();
    });

    it('should throw error when creation fails', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'invalid@gmail.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        userType: UserType.STUDENT
      };

      mockUserDomainService.createNewUser.mockRejectedValue(new Error('Email inválido'));

      // Act & Assert
      await expect(createUserUseCase.execute(createUserDto)).rejects.toThrow('Email inválido');
    });
  });

  describe('AuthenticateUserUseCase', () => {
    it('should authenticate user and return token', async () => {
      // Arrange
      const loginDto: LoginUserDto = {
        email: 'user@upt.pe',
        password: 'password123'
      };

      const mockUser = User.create({
        id: 'user123',
        email: 'user@upt.pe',
        firstName: 'María',
        lastName: 'García',
        userType: UserType.TEACHER
      });

      mockUserDomainService.authenticateUser.mockResolvedValue(mockUser);

      // Act
      const result = await authenticateUserUseCase.execute(loginDto);

      // Assert
      expect(result).toBeDefined();
      expect(result!.user.email).toBe('user@upt.pe');
      expect(result!.token).toContain('jwt_');
      expect(mockUserDomainService.authenticateUser).toHaveBeenCalledWith('user@upt.pe', 'password123');
    });

    it('should return null for invalid credentials', async () => {
      // Arrange
      const loginDto: LoginUserDto = {
        email: 'invalid@upt.pe',
        password: 'wrongpassword'
      };

      mockUserDomainService.authenticateUser.mockResolvedValue(null);

      // Act
      const result = await authenticateUserUseCase.execute(loginDto);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('GetUserProfileUseCase', () => {
    it('should return user profile', async () => {
      // Arrange
      const userId = 'user123';
      const mockUser = User.create({
        id: userId,
        email: 'user@upt.pe',
        firstName: 'Carlos',
        lastName: 'López',
        userType: UserType.ADMIN
      });

      mockUserDomainService.getUserProfile.mockResolvedValue(mockUser);

      // Act
      const result = await getUserProfileUseCase.execute(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result!.id).toBe(userId);
      expect(mockUserDomainService.getUserProfile).toHaveBeenCalledWith(userId);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = 'nonexistent';
      mockUserDomainService.getUserProfile.mockResolvedValue(null);

      // Act
      const result = await getUserProfileUseCase.execute(userId);

      // Assert
      expect(result).toBeNull();
    });
  });
});