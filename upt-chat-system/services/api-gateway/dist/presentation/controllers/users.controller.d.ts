import { GetUserProfileUseCase, ValidateUserForChatUseCase } from '../../application/use-cases/user.use-cases';
import { UserResponseDto } from '../../application/dtos/user.dto';
import type { CurrentUserDto } from '../../infrastructure/auth/decorators/current-user.decorator';
import { AppLoggerService } from '../../infrastructure/logging/logger.service';
import { MySQLConnectionService } from '../../infrastructure/services/mysql-connection.service';
export declare class UsersController {
    private readonly getUserProfileUseCase;
    private readonly validateUserForChatUseCase;
    private readonly logger;
    private readonly mysqlService;
    constructor(getUserProfileUseCase: GetUserProfileUseCase, validateUserForChatUseCase: ValidateUserForChatUseCase, logger: AppLoggerService, mysqlService: MySQLConnectionService);
    getProfile(userId: string, currentUser: CurrentUserDto): Promise<UserResponseDto>;
    validateForChat(userId: string, currentUser: CurrentUserDto): Promise<{
        canChat: boolean;
        reason?: string;
    }>;
    verifyEmail(body: {
        email: string;
    }): Promise<any>;
}
