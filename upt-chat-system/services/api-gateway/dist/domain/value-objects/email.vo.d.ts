export declare class Email {
    private readonly _value;
    constructor(email: string);
    get value(): string;
    private isValid;
    isUptEmail(): boolean;
    equals(other: Email): boolean;
    toString(): string;
}
