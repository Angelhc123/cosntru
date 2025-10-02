"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSession = exports.SessionStatus = void 0;
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["ACTIVE"] = "active";
    SessionStatus["ENDED"] = "ended";
    SessionStatus["ESCALATED"] = "escalated";
    SessionStatus["TIMEOUT"] = "timeout";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
class ChatSession {
    _id;
    _userId;
    _sessionToken;
    _isActive;
    _startedAt;
    _endedAt;
    _metadata;
    constructor(_id, _userId, _sessionToken, _isActive = true, _startedAt = new Date(), _endedAt, _metadata = {}) {
        this._id = _id;
        this._userId = _userId;
        this._sessionToken = _sessionToken;
        this._isActive = _isActive;
        this._startedAt = _startedAt;
        this._endedAt = _endedAt;
        this._metadata = _metadata;
    }
    get id() {
        return this._id;
    }
    get userId() {
        return this._userId;
    }
    get sessionToken() {
        return this._sessionToken;
    }
    get isActive() {
        return this._isActive;
    }
    get startedAt() {
        return this._startedAt;
    }
    get endedAt() {
        return this._endedAt;
    }
    get metadata() {
        return { ...this._metadata };
    }
    get duration() {
        if (!this._endedAt)
            return null;
        return this._endedAt.getTime() - this._startedAt.getTime();
    }
    get status() {
        if (this._isActive)
            return SessionStatus.ACTIVE;
        if (this._endedAt)
            return SessionStatus.ENDED;
        return SessionStatus.TIMEOUT;
    }
    endSession() {
        if (!this._isActive) {
            throw new Error('La sesión ya ha terminado');
        }
        this._isActive = false;
        this._endedAt = new Date();
    }
    updateMetadata(metadata) {
        this._metadata = { ...this._metadata, ...metadata };
    }
    incrementMessageCount() {
        this._metadata.totalMessages = (this._metadata.totalMessages || 0) + 1;
    }
    updateAverageResponseTime(responseTime) {
        const currentCount = this._metadata.totalMessages || 1;
        const currentAvg = this._metadata.avgResponseTime || 0;
        this._metadata.avgResponseTime =
            (currentAvg * (currentCount - 1) + responseTime) / currentCount;
    }
    setSatisfactionScore(score) {
        if (score < 1 || score > 5) {
            throw new Error('La puntuación debe estar entre 1 y 5');
        }
        this._metadata.satisfactionScore = score;
    }
    isExpired(maxDurationMs = 24 * 60 * 60 * 1000) {
        const now = new Date().getTime();
        const sessionStart = this._startedAt.getTime();
        return (now - sessionStart) > maxDurationMs;
    }
    static create(params) {
        if (!params.userId || params.userId.trim().length === 0) {
            throw new Error('ID de usuario es requerido');
        }
        if (!params.sessionToken || params.sessionToken.trim().length === 0) {
            throw new Error('Token de sesión es requerido');
        }
        return new ChatSession(params.id, params.userId, params.sessionToken, true, new Date(), undefined, params.metadata || {});
    }
    static generateSessionToken() {
        return `sess_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    }
}
exports.ChatSession = ChatSession;
//# sourceMappingURL=chat-session.entity.js.map