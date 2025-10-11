export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: UserType;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum UserType {
    STUDENT = "student",
    TEACHER = "teacher",
    ADMIN = "admin",
    STAFF = "staff"
}
export declare class User {
    private readonly _id;
    private readonly _email;
    private readonly _firstName;
    private readonly _lastName;
    private readonly _userType;
    private _isActive;
    private readonly _createdAt;
    private _updatedAt;
    constructor(_id: string, _email: string, _firstName: string, _lastName: string, _userType: UserType, _isActive?: boolean, _createdAt?: Date, _updatedAt?: Date);
    get id(): string;
    get email(): string;
    get firstName(): string;
    get lastName(): string;
    get fullName(): string;
    get userType(): UserType;
    get isActive(): boolean;
    get createdAt(): Date;
    get updatedAt(): Date;
    activate(): void;
    deactivate(): void;
    isStudent(): boolean;
    isTeacher(): boolean;
    isAdmin(): boolean;
    isStaff(): boolean;
    static isValidEmail(email: string): boolean;
    static create(params: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        userType: UserType;
    }): User;
}
