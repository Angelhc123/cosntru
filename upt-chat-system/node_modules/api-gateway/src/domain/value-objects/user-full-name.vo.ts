/**
 * Value Object: UserFullName
 * Representa el nombre completo de un usuario
 */
export class UserFullName {
  private readonly _firstName: string;
  private readonly _lastName: string;

  constructor(firstName: string, lastName: string) {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('Nombre es requerido');
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Apellido es requerido');
    }

    this._firstName = this.formatName(firstName);
    this._lastName = this.formatName(lastName);
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

  get initials(): string {
    return `${this._firstName.charAt(0)}${this._lastName.charAt(0)}`.toUpperCase();
  }

  private formatName(name: string): string {
    return name
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  equals(other: UserFullName): boolean {
    return this._firstName === other._firstName && this._lastName === other._lastName;
  }

  toString(): string {
    return this.fullName;
  }
}