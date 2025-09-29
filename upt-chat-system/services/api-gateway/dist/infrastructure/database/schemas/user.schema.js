"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.UserDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("../../../domain/entities/user.entity");
let UserDocument = class UserDocument extends mongoose_2.Document {
    email;
    firstName;
    lastName;
    userType;
    isActive;
    createdAt;
    updatedAt;
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
};
exports.UserDocument = UserDocument;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido']
    }),
    __metadata("design:type", String)
], UserDocument.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    }),
    __metadata("design:type", String)
], UserDocument.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    }),
    __metadata("design:type", String)
], UserDocument.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: Object.values(user_entity_1.UserType),
        type: String
    }),
    __metadata("design:type", String)
], UserDocument.prototype, "userType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: true,
        type: Boolean
    }),
    __metadata("design:type", Boolean)
], UserDocument.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: Date.now,
        type: Date
    }),
    __metadata("design:type", Date)
], UserDocument.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: Date.now,
        type: Date
    }),
    __metadata("design:type", Date)
], UserDocument.prototype, "updatedAt", void 0);
exports.UserDocument = UserDocument = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'users',
        timestamps: true,
        versionKey: false
    })
], UserDocument);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(UserDocument);
exports.UserSchema.index({ email: 1 }, { unique: true });
exports.UserSchema.index({ userType: 1, isActive: 1 });
exports.UserSchema.index({ createdAt: -1 });
exports.UserSchema.index({
    firstName: 'text',
    lastName: 'text',
    email: 'text'
}, {
    name: 'user_search_index'
});
exports.UserSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
exports.UserSchema.set('toJSON', { virtuals: true });
exports.UserSchema.set('toObject', { virtuals: true });
//# sourceMappingURL=user.schema.js.map