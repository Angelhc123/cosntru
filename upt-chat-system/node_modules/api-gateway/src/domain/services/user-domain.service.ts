import { User, UserType } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository.interface';
import { Email } from '../value-objects/email.vo';

/**
 * Domain Service: UserService
 * Contiene la lógica de negocio relacionada con usuarios
 */
export class UserDomainService {
  constructor(private readonly userRepository: IUserRepository) {}

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const emailVO = new Email(email);
    const user = await this.userRepository.findByEmail(emailVO.value);
    
    if (!user || !user.isActive) {
      return null;
    }

    // Aquí integrarías con el sistema de autenticación de UPT
    // Por ahora, simulamos la validación
    return user;
  }

  async createNewUser(userData: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: UserType;
  }): Promise<User> {
    // Validar que el email no exista
    const emailExists = await this.userRepository.existsByEmail(userData.email);
    if (emailExists) {
      throw new Error('El email ya está registrado en el sistema');
    }

    // Validar que sea un email de UPT para estudiantes y docentes
    const emailVO = new Email(userData.email);
    if ((userData.userType === UserType.STUDENT || userData.userType === UserType.TEACHER) 
        && !emailVO.isUptEmail()) {
      throw new Error('Los estudiantes y docentes deben usar email institucional');
    }

    const user = User.create(userData);
    return await this.userRepository.create(user);
  }

  async getUserProfile(userId: string): Promise<User | null> {
    return await this.userRepository.findById(userId);
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (isActive) {
      user.activate();
    } else {
      user.deactivate();
    }

    return await this.userRepository.update(userId, user);
  }

  async validateUserForChat(userId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    return user?.isActive || false;
  }

  async getUsersByType(userType: UserType): Promise<User[]> {
    return await this.userRepository.findAll({ userType });
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    return await this.userRepository.findAll({ searchTerm });
  }
}