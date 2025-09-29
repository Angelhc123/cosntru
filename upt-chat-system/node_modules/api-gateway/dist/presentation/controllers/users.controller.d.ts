import { CreateUserUseCase, AuthenticateUserUseCase, GetUserProfileUseCase, ValidateUserForChatUseCase, GetUsersByTypeUseCase } from '../../application/use-cases/user.use-cases';
import { CreateUserDto, LoginUserDto, UserResponseDto } from '../../application/dtos/user.dto';
import { UserType } from '../../domain/entities/user.entity';
export declare class UsersController {
    private readonly createUserUseCase;
    private readonly authenticateUserUseCase;
    private readonly getUserProfileUseCase;
    private readonly validateUserForChatUseCase;
    private readonly getUsersByTypeUseCase;
    constructor(createUserUseCase: CreateUserUseCase, authenticateUserUseCase: AuthenticateUserUseCase, getUserProfileUseCase: GetUserProfileUseCase, validateUserForChatUseCase: ValidateUserForChatUseCase, getUsersByTypeUseCase: GetUsersByTypeUseCase);
    register(createUserDto: CreateUserDto): Promise<{
        status: string;
        message: string;
        data: UserResponseDto;
    }>;
    login(loginDto: LoginUserDto): Promise<{
        status: string;
        message: string;
        data?: {
            user: UserResponseDto;
            token: string;
        };
    }>;
    getProfile(userId: string): Promise<{
        status: string;
        message: string;
        data?: UserResponseDto;
    }>;
    validateForChat(userId: string): Promise<{
        status: string;
        message: string;
        data: {
            canChat: boolean;
        };
    }>;
    getUsersByType(userType: UserType): Promise<{
        status: string;
        message: string;
        data: {
            users: UserResponseDto[];
            count: number;
        };
    }>;
}
