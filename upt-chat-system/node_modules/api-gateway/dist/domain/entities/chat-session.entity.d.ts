export interface IChatSession {
    id: string;
    userId: string;
    sessionToken: string;
    isActive: boolean;
    startedAt: Date;
    endedAt?: Date;
    metadata: SessionMetadata;
}
export interface SessionMetadata {
    userAgent?: string;
    ipAddress?: string;
    platform?: string;
    initialQuery?: string;
    totalMessages?: number;
    avgResponseTime?: number;
    satisfactionScore?: number;
}
export declare enum SessionStatus {
    ACTIVE = "active",
    ENDED = "ended",
    ESCALATED = "escalated",
    TIMEOUT = "timeout"
}
export declare class ChatSession {
    private readonly _id;
    private readonly _userId;
    private readonly _sessionToken;
    private _isActive;
    private readonly _startedAt;
    private _endedAt?;
    private _metadata;
    constructor(_id: string, _userId: string, _sessionToken: string, _isActive?: boolean, _startedAt?: Date, _endedAt?: Date | undefined, _metadata?: SessionMetadata);
    get id(): string;
    get userId(): string;
    get sessionToken(): string;
    get isActive(): boolean;
    get startedAt(): Date;
    get endedAt(): Date | undefined;
    get metadata(): SessionMetadata;
    get duration(): number | null;
    get status(): SessionStatus;
    endSession(): void;
    updateMetadata(metadata: Partial<SessionMetadata>): void;
    incrementMessageCount(): void;
    updateAverageResponseTime(responseTime: number): void;
    setSatisfactionScore(score: number): void;
    isExpired(maxDurationMs?: number): boolean;
    static create(params: {
        id: string;
        userId: string;
        sessionToken: string;
        metadata?: SessionMetadata;
    }): ChatSession;
    static generateSessionToken(): string;
}
