export declare class UserFullName {
    private readonly _firstName;
    private readonly _lastName;
    constructor(firstName: string, lastName: string);
    get firstName(): string;
    get lastName(): string;
    get fullName(): string;
    get initials(): string;
    private formatName;
    equals(other: UserFullName): boolean;
    toString(): string;
}
