import { User } from '../entities/user.entity';
export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(filters?: UserFilters): Promise<User[]>;
    create(user: User): Promise<User>;
    update(id: string, user: Partial<User>): Promise<User>;
    delete(id: string): Promise<boolean>;
    existsByEmail(email: string): Promise<boolean>;
    findActiveUsers(): Promise<User[]>;
    countByUserType(userType: string): Promise<number>;
}
export interface UserFilters {
    userType?: string;
    isActive?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
    searchTerm?: string;
}
