/**
 * Entity: Sesión de Chat
 * Representa una sesión de conversación del usuario con el agente virtual
 */

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

export enum SessionStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  ESCALATED = 'escalated',
  TIMEOUT = 'timeout'
}

export class ChatSession {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _sessionToken: string,
    private _isActive: boolean = true,
    private readonly _startedAt: Date = new Date(),
    private _endedAt?: Date,
    private _metadata: SessionMetadata = {}
  ) {}

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get sessionToken(): string {
    return this._sessionToken;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get startedAt(): Date {
    return this._startedAt;
  }

  get endedAt(): Date | undefined {
    return this._endedAt;
  }

  get metadata(): SessionMetadata {
    return { ...this._metadata };
  }

  get duration(): number | null {
    if (!this._endedAt) return null;
    return this._endedAt.getTime() - this._startedAt.getTime();
  }

  get status(): SessionStatus {
    if (this._isActive) return SessionStatus.ACTIVE;
    if (this._endedAt) return SessionStatus.ENDED;
    return SessionStatus.TIMEOUT;
  }

  // Business methods
  endSession(): void {
    if (!this._isActive) {
      throw new Error('La sesión ya ha terminado');
    }
    
    this._isActive = false;
    this._endedAt = new Date();
  }

  updateMetadata(metadata: Partial<SessionMetadata>): void {
    this._metadata = { ...this._metadata, ...metadata };
  }

  incrementMessageCount(): void {
    this._metadata.totalMessages = (this._metadata.totalMessages || 0) + 1;
  }

  updateAverageResponseTime(responseTime: number): void {
    const currentCount = this._metadata.totalMessages || 1;
    const currentAvg = this._metadata.avgResponseTime || 0;
    
    this._metadata.avgResponseTime = 
      (currentAvg * (currentCount - 1) + responseTime) / currentCount;
  }

  setSatisfactionScore(score: number): void {
    if (score < 1 || score > 5) {
      throw new Error('La puntuación debe estar entre 1 y 5');
    }
    this._metadata.satisfactionScore = score;
  }

  // Validation methods
  isExpired(maxDurationMs: number = 24 * 60 * 60 * 1000): boolean { // 24 horas por defecto
    const now = new Date().getTime();
    const sessionStart = this._startedAt.getTime();
    return (now - sessionStart) > maxDurationMs;
  }

  // Factory method
  static create(params: {
    id: string;
    userId: string;
    sessionToken: string;
    metadata?: SessionMetadata;
  }): ChatSession {
    if (!params.userId || params.userId.trim().length === 0) {
      throw new Error('ID de usuario es requerido');
    }

    if (!params.sessionToken || params.sessionToken.trim().length === 0) {
      throw new Error('Token de sesión es requerido');
    }

    return new ChatSession(
      params.id,
      params.userId,
      params.sessionToken,
      true,
      new Date(),
      undefined,
      params.metadata || {}
    );
  }

  static generateSessionToken(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}