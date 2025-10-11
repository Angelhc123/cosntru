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
exports.ChatSessionSchema = exports.ChatSessionDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ChatSessionDocument = class ChatSessionDocument extends mongoose_2.Document {
    userId;
    sessionToken;
    isActive;
    startedAt;
    endedAt;
    metadata;
    get duration() {
        if (!this.endedAt)
            return null;
        return this.endedAt.getTime() - this.startedAt.getTime();
    }
    get status() {
        if (this.isActive)
            return 'active';
        if (this.endedAt)
            return 'ended';
        return 'timeout';
    }
};
exports.ChatSessionDocument = ChatSessionDocument;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
        index: true
    }),
    __metadata("design:type", String)
], ChatSessionDocument.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        unique: true,
        trim: true
    }),
    __metadata("design:type", String)
], ChatSessionDocument.prototype, "sessionToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: true,
        type: Boolean,
        index: true
    }),
    __metadata("design:type", Boolean)
], ChatSessionDocument.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: Date.now,
        type: Date,
        index: true
    }),
    __metadata("design:type", Date)
], ChatSessionDocument.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: null
    }),
    __metadata("design:type", Date)
], ChatSessionDocument.prototype, "endedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            userAgent: { type: String, default: null },
            ipAddress: { type: String, default: null },
            platform: { type: String, default: null },
            initialQuery: { type: String, default: null },
            totalMessages: { type: Number, default: 0 },
            avgResponseTime: { type: Number, default: 0 },
            satisfactionScore: { type: Number, min: 1, max: 5, default: null }
        },
        default: {}
    }),
    __metadata("design:type", Object)
], ChatSessionDocument.prototype, "metadata", void 0);
exports.ChatSessionDocument = ChatSessionDocument = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'chat_sessions',
        timestamps: true,
        versionKey: false
    })
], ChatSessionDocument);
exports.ChatSessionSchema = mongoose_1.SchemaFactory.createForClass(ChatSessionDocument);
exports.ChatSessionSchema.index({ userId: 1, isActive: 1 });
exports.ChatSessionSchema.index({ sessionToken: 1 }, { unique: true });
exports.ChatSessionSchema.index({ startedAt: -1 });
exports.ChatSessionSchema.index({ endedAt: -1 });
exports.ChatSessionSchema.index({
    isActive: 1,
    startedAt: 1
}, {
    name: 'active_sessions_index'
});
exports.ChatSessionSchema.index({
    startedAt: 1
}, {
    expireAfterSeconds: 30 * 24 * 60 * 60,
    name: 'session_ttl_index'
});
exports.ChatSessionSchema.virtual('duration').get(function () {
    if (!this.endedAt)
        return null;
    return this.endedAt.getTime() - this.startedAt.getTime();
});
exports.ChatSessionSchema.virtual('status').get(function () {
    if (this.isActive)
        return 'active';
    if (this.endedAt)
        return 'ended';
    return 'timeout';
});
exports.ChatSessionSchema.set('toJSON', { virtuals: true });
exports.ChatSessionSchema.set('toObject', { virtuals: true });
//# sourceMappingURL=chat-session.schema.js.map