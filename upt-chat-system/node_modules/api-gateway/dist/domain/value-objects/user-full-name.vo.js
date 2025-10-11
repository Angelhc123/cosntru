"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFullName = void 0;
class UserFullName {
    _firstName;
    _lastName;
    constructor(firstName, lastName) {
        if (!firstName || firstName.trim().length === 0) {
            throw new Error('Nombre es requerido');
        }
        if (!lastName || lastName.trim().length === 0) {
            throw new Error('Apellido es requerido');
        }
        this._firstName = this.formatName(firstName);
        this._lastName = this.formatName(lastName);
    }
    get firstName() {
        return this._firstName;
    }
    get lastName() {
        return this._lastName;
    }
    get fullName() {
        return `${this._firstName} ${this._lastName}`;
    }
    get initials() {
        return `${this._firstName.charAt(0)}${this._lastName.charAt(0)}`.toUpperCase();
    }
    formatName(name) {
        return name
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    equals(other) {
        return this._firstName === other._firstName && this._lastName === other._lastName;
    }
    toString() {
        return this.fullName;
    }
}
exports.UserFullName = UserFullName;
//# sourceMappingURL=user-full-name.vo.js.map