import { User, UserType } from '../entities/user.entity';

/**
 * Repository Interface: IUserRepository
 * Define operaciones de consulta sobre la base de datos de usuarios UPT
 * NOTA: Este repositorio SOLO consulta datos existentes, NO crea/modifica usuarios UPT
 */
export interface IUserRepository {
  // Consultas de lectura de la BD UPT
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailInUptDatabase(email: string): Promise<User | null>;
  findAll(filters?: UserFilters): Promise<User[]>;
  findActiveUsers(): Promise<User[]>;
  countByUserType(userType: UserType): Promise<number>;
  
  // Métodos de verificación (solo lectura)
  existsByEmail(email: string): Promise<boolean>;
  
  // NOTA: Los siguientes métodos NO deben usarse para crear usuarios UPT
  // Solo se mantienen para sincronización local de caché si es necesario
  syncUserFromUpt(user: User): Promise<User>; // Solo para caché local
  updateLocalUserCache(id: string, userData: Partial<User>): Promise<User>; // Solo caché
  delete(id: string): Promise<boolean>; // Solo para limpieza de caché
}

export interface UserFilters {
  userType?: UserType;
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  searchTerm?: string;
}