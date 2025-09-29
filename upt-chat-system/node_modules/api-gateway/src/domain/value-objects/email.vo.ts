/**
 * Value Object: Email
 * Representa un email válido del sistema UPT
 */
export class Email {
  private readonly _value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error('Formato de email inválido');
    }
    this._value = email.toLowerCase().trim();
  }

  get value(): string {
    return this._value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.trim().length > 0;
  }

  isUptEmail(): boolean {
    return this._value.endsWith('@upt.pe') || this._value.endsWith('@upt.edu.pe');
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}