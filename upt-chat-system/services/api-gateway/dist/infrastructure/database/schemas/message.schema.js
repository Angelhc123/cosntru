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
exports.MessageSchema = exports.MessageDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MessageDocument = class MessageDocument extends mongoose_2.Document {
    sessionId;
    sender;
    text;
    timestamp;
    metadata;
};
exports.MessageDocument = MessageDocument;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: String,
        index: true
    }),
    __metadata("design:type", String)
], MessageDocument.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['user', 'bot', 'system'],
        type: String
    }),
    __metadata("design:type", String)
], MessageDocument.prototype, "sender", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: String,
        trim: true
    }),
    __metadata("design:type", String)
], MessageDocument.prototype, "text", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: Date.now,
        type: Date,
        index: true
    }),
    __metadata("design:type", Date)
], MessageDocument.prototype, "timestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {}
    }),
    __metadata("design:type", Object)
], MessageDocument.prototype, "metadata", void 0);
exports.MessageDocument = MessageDocument = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'messages',
        timestamps: true,
        versionKey: false
    })
], MessageDocument);
exports.MessageSchema = mongoose_1.SchemaFactory.createForClass(MessageDocument);
exports.MessageSchema.index({ sessionId: 1, timestamp: 1 });
//# sourceMappingURL=message.schema.js.map