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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUserRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("../../../domain/entities/user.entity");
let MongoUserRepository = class MongoUserRepository {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findById(id) {
        const userDoc = await this.userModel.findById(id).exec();
        return userDoc ? this.toDomain(userDoc) : null;
    }
    async findByEmail(email) {
        const userDoc = await this.userModel.findOne({
            email: email.toLowerCase().trim()
        }).exec();
        return userDoc ? this.toDomain(userDoc) : null;
    }
    async findAll(filters) {
        const query = this.buildQuery(filters);
        const userDocs = await this.userModel.find(query).exec();
        return userDocs.map(doc => this.toDomain(doc));
    }
    async findByEmailInUptDatabase(email) {
        return this.findByEmail(email);
    }
    async syncUserFromUpt(user) {
        const existing = await this.userModel.findOne({ email: user.email }).exec();
        if (existing) {
            existing.firstName = user.firstName;
            existing.lastName = user.lastName;
            existing.userType = user.userType;
            existing.isActive = user.isActive;
            existing.updatedAt = new Date();
            const updated = await existing.save();
            return this.toDomain(updated);
        }
        const userDoc = new this.userModel({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.userType,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
        const savedDoc = await userDoc.save();
        return this.toDomain(savedDoc);
    }
    async updateLocalUserCache(id, userData) {
        const updateData = {};
        if (userData.firstName)
            updateData.firstName = userData.firstName;
        if (userData.lastName)
            updateData.lastName = userData.lastName;
        if (userData.isActive !== undefined)
            updateData.isActive = userData.isActive;
        updateData.updatedAt = new Date();
        const updatedDoc = await this.userModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
        if (!updatedDoc) {
            throw new Error('Usuario no encontrado');
        }
        return this.toDomain(updatedDoc);
    }
    async delete(id) {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        return !!result;
    }
    async existsByEmail(email) {
        const count = await this.userModel.countDocuments({
            email: email.toLowerCase().trim()
        }).exec();
        return count > 0;
    }
    async findActiveUsers() {
        const userDocs = await this.userModel.find({ isActive: true }).exec();
        return userDocs.map(doc => this.toDomain(doc));
    }
    async countByUserType(userType) {
        return await this.userModel.countDocuments({ userType }).exec();
    }
    buildQuery(filters) {
        const query = {};
        if (filters) {
            if (filters.userType) {
                query.userType = filters.userType;
            }
            if (filters.isActive !== undefined) {
                query.isActive = filters.isActive;
            }
            if (filters.createdAfter) {
                query.createdAt = { ...query.createdAt, $gte: filters.createdAfter };
            }
            if (filters.createdBefore) {
                query.createdAt = { ...query.createdAt, $lte: filters.createdBefore };
            }
            if (filters.searchTerm) {
                query.$text = { $search: filters.searchTerm };
            }
        }
        return query;
    }
    toDomain(userDoc) {
        return user_entity_1.User.create({
            id: userDoc._id.toString(),
            email: userDoc.email,
            firstName: userDoc.firstName,
            lastName: userDoc.lastName,
            userType: userDoc.userType
        });
    }
};
exports.MongoUserRepository = MongoUserRepository;
exports.MongoUserRepository = MongoUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MongoUserRepository);
//# sourceMappingURL=mongo-user.repository.js.map