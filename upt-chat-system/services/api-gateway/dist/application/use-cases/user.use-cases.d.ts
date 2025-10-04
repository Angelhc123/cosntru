import { JwtService } from '@nestjs/jwt';
import { UserDomainService } from '../../domain/services/user-domain.service';
import { UserResponseDto, LoginUserDto } from '../dtos/user.dto';
import { UserType } from '../../domain/entities/user.entity';
import { AppLoggerService } from '../../infrastructure/logging/logger.service';
export declare class AuthenticateUserUseCase {
    private readonly userDomainService;
    private readonly jwtService;
    private readonly logger;
    constructor(userDomainService: UserDomainService, jwtService: JwtService, logger: AppLoggerService);
    execute(loginDto: LoginUserDto): Promise<{
        user: UserResponseDto;
        access_token: string;
        token_type: string;
        expires_in: string;
    } | null>;
    private generateJwtToken;
}
export declare class GetUserProfileUseCase {
    private readonly userDomainService;
    constructor(userDomainService: UserDomainService);
    execute(userId: string): Promise<UserResponseDto | null>;
}
export declare class ValidateUserForChatUseCase {
    private readonly userDomainService;
    constructor(userDomainService: UserDomainService);
    execute(userId: string): Promise<boolean>;
}
export declare class GetUsersByTypeUseCase {
    private readonly userDomainService;
    constructor(userDomainService: UserDomainService);
    execute(userType: UserType): Promise<UserResponseDto[]>;
}
