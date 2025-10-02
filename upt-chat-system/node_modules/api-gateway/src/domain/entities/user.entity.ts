/**
 * Entity: Usuario UPT
 * Representa a un usuario del sistema universitario (estudiante, docente, administrativo)
 */

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

export enum UserType {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  STAFF = 'staff'
}

export class User {
  constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _firstName: string,
    private readonly _lastName: string,
    private readonly _userType: UserType,
    private _isActive: boolean = true,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date()
  ) {}

  // Getters
  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get userType(): UserType {
    return this._userType;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  isStudent(): boolean {
    return this._userType === UserType.STUDENT;
  }

  isTeacher(): boolean {
    return this._userType === UserType.TEACHER;
  }

  isAdmin(): boolean {
    return this._userType === UserType.ADMIN;
  }

  isStaff(): boolean {
    return this._userType === UserType.STAFF;
  }

  // Validation methods
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Factory method
  static create(params: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: UserType;
  }): User {
    if (!this.isValidEmail(params.email)) {
      throw new Error('Email inválido');
    }

    if (!params.firstName || params.firstName.trim().length === 0) {
      throw new Error('Nombre es requerido');
    }

    if (!params.lastName || params.lastName.trim().length === 0) {
      throw new Error('Apellido es requerido');
    }

    return new User(
      params.id,
      params.email.toLowerCase().trim(),
      params.firstName.trim(),
      params.lastName.trim(),
      params.userType
    );
  }
}