"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserType = void 0;
var UserType;
(function (UserType) {
    UserType["STUDENT"] = "student";
    UserType["TEACHER"] = "teacher";
    UserType["ADMIN"] = "admin";
    UserType["STAFF"] = "staff";
})(UserType || (exports.UserType = UserType = {}));
class User {
    _id;
    _email;
    _firstName;
    _lastName;
    _userType;
    _isActive;
    _createdAt;
    _updatedAt;
    constructor(_id, _email, _firstName, _lastName, _userType, _isActive = true, _createdAt = new Date(), _updatedAt = new Date()) {
        this._id = _id;
        this._email = _email;
        this._firstName = _firstName;
        this._lastName = _lastName;
        this._userType = _userType;
        this._isActive = _isActive;
        this._createdAt = _createdAt;
        this._updatedAt = _updatedAt;
    }
    get id() {
        return this._id;
    }
    get email() {
        return this._email;
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
    get userType() {
        return this._userType;
    }
    get isActive() {
        return this._isActive;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    activate() {
        this._isActive = true;
        this._updatedAt = new Date();
    }
    deactivate() {
        this._isActive = false;
        this._updatedAt = new Date();
    }
    isStudent() {
        return this._userType === UserType.STUDENT;
    }
    isTeacher() {
        return this._userType === UserType.TEACHER;
    }
    isAdmin() {
        return this._userType === UserType.ADMIN;
    }
    isStaff() {
        return this._userType === UserType.STAFF;
    }
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static create(params) {
        if (!this.isValidEmail(params.email)) {
            throw new Error('Email inválido');
        }
        if (!params.firstName || params.firstName.trim().length === 0) {
            throw new Error('Nombre es requerido');
        }
        if (!params.lastName || params.lastName.trim().length === 0) {
            throw new Error('Apellido es requerido');
        }
        return new User(params.id, params.email.toLowerCase().trim(), params.firstName.trim(), params.lastName.trim(), params.userType);
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map