import { UserDomainService } from '../../domain/services/user-domain.service';
import { CreateUserDto, UserResponseDto, LoginUserDto } from '../dtos/user.dto';
import { UserType } from '../../domain/entities/user.entity';
export declare class CreateUserUseCase {
    private readonly userDomainService;
    constructor(userDomainService: UserDomainService);
    execute(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    private generateUserId;
}
export declare class AuthenticateUserUseCase {
    private readonly userDomainService;
    constructor(userDomainService: UserDomainService);
    execute(loginDto: LoginUserDto): Promise<{
        user: UserResponseDto;
        token: string;
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
