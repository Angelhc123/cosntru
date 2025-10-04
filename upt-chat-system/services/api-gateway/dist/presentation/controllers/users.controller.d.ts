import { AuthenticateUserUseCase, GetUserProfileUseCase, ValidateUserForChatUseCase, GetUsersByTypeUseCase } from '../../application/use-cases/user.use-cases';
import { LoginUserDto, UserResponseDto } from '../../application/dtos/user.dto';
import { UserType } from '../../domain/entities/user.entity';
import type { CurrentUserDto } from '../../infrastructure/auth/decorators/current-user.decorator';
import { AppLoggerService } from '../../infrastructure/logging/logger.service';
export declare class UsersController {
    private readonly authenticateUserUseCase;
    private readonly getUserProfileUseCase;
    private readonly validateUserForChatUseCase;
    private readonly getUsersByTypeUseCase;
    private readonly logger;
    constructor(authenticateUserUseCase: AuthenticateUserUseCase, getUserProfileUseCase: GetUserProfileUseCase, validateUserForChatUseCase: ValidateUserForChatUseCase, getUsersByTypeUseCase: GetUsersByTypeUseCase, logger: AppLoggerService);
    login(loginDto: LoginUserDto): Promise<{
        user: UserResponseDto;
        access_token: string;
        token_type: string;
        expires_in: string;
    }>;
    getProfile(userId: string, currentUser: CurrentUserDto): Promise<UserResponseDto>;
    validateForChat(userId: string, currentUser: CurrentUserDto): Promise<{
        canChat: boolean;
    }>;
    getUsersByType(userType: UserType, currentUser: CurrentUserDto): Promise<{
        users: UserResponseDto[];
        count: number;
    }>;
}
