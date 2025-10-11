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
exports.MongoChatSessionRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_session_entity_1 = require("../../../domain/entities/chat-session.entity");
let MongoChatSessionRepository = class MongoChatSessionRepository {
    sessionModel;
    constructor(sessionModel) {
        this.sessionModel = sessionModel;
    }
    async findById(id) {
        const sessionDoc = await this.sessionModel.findById(id).exec();
        return sessionDoc ? this.toDomain(sessionDoc) : null;
    }
    async findByUserId(userId) {
        const sessionDocs = await this.sessionModel
            .find({ userId })
            .sort({ startedAt: -1 })
            .exec();
        return sessionDocs.map(doc => this.toDomain(doc));
    }
    async findActiveByUserId(userId) {
        const sessionDoc = await this.sessionModel
            .findOne({ userId, isActive: true })
            .exec();
        return sessionDoc ? this.toDomain(sessionDoc) : null;
    }
    async findBySessionToken(token) {
        const sessionDoc = await this.sessionModel
            .findOne({ sessionToken: token })
            .exec();
        return sessionDoc ? this.toDomain(sessionDoc) : null;
    }
    async create(session) {
        const sessionDoc = new this.sessionModel({
            userId: session.userId,
            sessionToken: session.sessionToken,
            isActive: session.isActive,
            startedAt: session.startedAt,
            endedAt: session.endedAt,
            metadata: session.metadata
        });
        const savedDoc = await sessionDoc.save();
        return this.toDomain(savedDoc);
    }
    async update(id, sessionData) {
        const updateData = {};
        if (sessionData.isActive !== undefined)
            updateData.isActive = sessionData.isActive;
        if (sessionData.endedAt !== undefined)
            updateData.endedAt = sessionData.endedAt;
        if (sessionData.metadata)
            updateData.metadata = sessionData.metadata;
        const updatedDoc = await this.sessionModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
        if (!updatedDoc) {
            throw new Error('Sesión no encontrada');
        }
        return this.toDomain(updatedDoc);
    }
    async endSession(id) {
        const result = await this.sessionModel.findByIdAndUpdate(id, {
            isActive: false,
            endedAt: new Date()
        }, { new: true }).exec();
        return !!result;
    }
    async findActiveSessions() {
        const sessionDocs = await this.sessionModel
            .find({ isActive: true })
            .sort({ startedAt: -1 })
            .exec();
        return sessionDocs.map(doc => this.toDomain(doc));
    }
    async findExpiredSessions(maxDurationMs) {
        const expiryDate = new Date(Date.now() - maxDurationMs);
        const sessionDocs = await this.sessionModel
            .find({
            isActive: true,
            startedAt: { $lt: expiryDate }
        })
            .exec();
        return sessionDocs.map(doc => this.toDomain(doc));
    }
    async deleteSession(id) {
        const result = await this.sessionModel.findByIdAndDelete(id).exec();
        return !!result;
    }
    async findSessionsByDateRange(from, to) {
        const sessionDocs = await this.sessionModel
            .find({
            startedAt: {
                $gte: from,
                $lte: to
            }
        })
            .sort({ startedAt: -1 })
            .exec();
        return sessionDocs.map(doc => this.toDomain(doc));
    }
    async countActiveSessionsForUser(userId) {
        return await this.sessionModel.countDocuments({
            userId,
            isActive: true
        }).exec();
    }
    buildQuery(filters) {
        const query = {};
        if (filters) {
            if (filters.userId) {
                query.userId = filters.userId;
            }
            if (filters.isActive !== undefined) {
                query.isActive = filters.isActive;
            }
            if (filters.startedAfter) {
                query.startedAt = { ...query.startedAt, $gte: filters.startedAfter };
            }
            if (filters.startedBefore) {
                query.startedAt = { ...query.startedAt, $lte: filters.startedBefore };
            }
        }
        return query;
    }
    toDomain(sessionDoc) {
        return chat_session_entity_1.ChatSession.create({
            id: sessionDoc._id.toString(),
            userId: sessionDoc.userId,
            sessionToken: sessionDoc.sessionToken,
            metadata: sessionDoc.metadata
        });
    }
};
exports.MongoChatSessionRepository = MongoChatSessionRepository;
exports.MongoChatSessionRepository = MongoChatSessionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('ChatSession')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MongoChatSessionRepository);
//# sourceMappingURL=mongo-chat-session.repository.js.map