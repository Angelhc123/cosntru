import { User, UserType } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository.interface';
import { Email } from '../value-objects/email.vo';

/**
 * Domain Service: UserService
 * Contiene la lógica de negocio relacionada con usuarios
 */
export class UserDomainService {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Autentica un usuario consultando la base de datos EXISTENTE de UPT
   * NO crea usuarios nuevos, solo valida credenciales contra la BD de UPT
   */
  async authenticateUserFromUptDatabase(email: string, password: string): Promise<User | null> {
    const emailVO = new Email(email);
    
    // Consultar usuario en la base de datos de UPT (solo lectura)
    const user = await this.userRepository.findByEmailInUptDatabase(emailVO.value);
    
    if (!user || !user.isActive) {
      return null;
    }

    // TODO: Integrar con el sistema de autenticación real de UPT
    // Esto podría ser:
    // - API REST del sistema de autenticación de UPT
    // - LDAP/Active Directory de la universidad
    // - Base de datos centralizada de usuarios
    // Por ahora, simulamos la validación
    const isValidPassword = await this.validatePasswordWithUptSystem(password, user);
    
    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  /**
   * Valida la contraseña contra el sistema de autenticación de UPT
   * TODO: Implementar integración real con sistema UPT
   */
  private async validatePasswordWithUptSystem(password: string, user: User): Promise<boolean> {
    // Placeholder - aquí iría la validación real contra sistema UPT
    // Ejemplos:
    // - Llamada a API de autenticación UPT
    // - Verificación LDAP
    // - Consulta a tabla de credenciales
    return true; // Temporal
  }

  async getUserProfile(userId: string): Promise<User | null> {
    return await this.userRepository.findById(userId);
  }

  /**
   * Actualiza estado del usuario en caché local
   * NOTA: Esto NO modifica el usuario en la BD de UPT
   */
  async updateUserStatusInLocalCache(userId: string, isActive: boolean): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (isActive) {
      user.activate();
    } else {
      user.deactivate();
    }

    return await this.userRepository.updateLocalUserCache(userId, user);
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