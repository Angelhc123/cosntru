"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    _value;
    constructor(email) {
        if (!this.isValid(email)) {
            throw new Error('Formato de email inválido');
        }
        this._value = email.toLowerCase().trim();
    }
    get value() {
        return this._value;
    }
    isValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.trim().length > 0;
    }
    isUptEmail() {
        return this._value.endsWith('@upt.pe') || this._value.endsWith('@upt.edu.pe');
    }
    equals(other) {
        return this._value === other._value;
    }
    toString() {
        return this._value;
    }
}
exports.Email = Email;
//# sourceMappingURL=email.vo.js.map