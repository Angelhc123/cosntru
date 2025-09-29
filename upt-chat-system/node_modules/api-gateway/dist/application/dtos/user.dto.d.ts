import { UserType } from '../../domain/entities/user.entity';
export declare class CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    userType: UserType;
}
export declare class LoginUserDto {
    email: string;
    password: string;
}
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    userType: UserType;
    isActive: boolean;
    createdAt: Date;
    static fromDomain(user: any): UserResponseDto;
}
