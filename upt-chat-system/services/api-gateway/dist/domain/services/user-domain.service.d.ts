import { User, UserType } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository.interface';
export declare class UserDomainService {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    authenticateUser(email: string, password: string): Promise<User | null>;
    createNewUser(userData: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        userType: UserType;
    }): Promise<User>;
    getUserProfile(userId: string): Promise<User | null>;
    updateUserStatus(userId: string, isActive: boolean): Promise<User>;
    validateUserForChat(userId: string): Promise<boolean>;
    getUsersByType(userType: UserType): Promise<User[]>;
    searchUsers(searchTerm: string): Promise<User[]>;
}
