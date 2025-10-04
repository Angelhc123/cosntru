import { User, UserType } from '../entities/user.entity';
export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailInUptDatabase(email: string): Promise<User | null>;
    findAll(filters?: UserFilters): Promise<User[]>;
    findActiveUsers(): Promise<User[]>;
    countByUserType(userType: UserType): Promise<number>;
    existsByEmail(email: string): Promise<boolean>;
    syncUserFromUpt(user: User): Promise<User>;
    updateLocalUserCache(id: string, userData: Partial<User>): Promise<User>;
    delete(id: string): Promise<boolean>;
}
export interface UserFilters {
    userType?: UserType;
    isActive?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
    searchTerm?: string;
}
