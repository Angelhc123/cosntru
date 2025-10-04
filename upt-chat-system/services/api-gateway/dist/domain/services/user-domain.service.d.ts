import { User, UserType } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository.interface';
export declare class UserDomainService {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    authenticateUserFromUptDatabase(email: string, password: string): Promise<User | null>;
    private validatePasswordWithUptSystem;
    getUserProfile(userId: string): Promise<User | null>;
    updateUserStatusInLocalCache(userId: string, isActive: boolean): Promise<User>;
    validateUserForChat(userId: string): Promise<boolean>;
    getUsersByType(userType: UserType): Promise<User[]>;
    searchUsers(searchTerm: string): Promise<User[]>;
}
