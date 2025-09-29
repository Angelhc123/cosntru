import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatSession } from '../../../domain/entities/chat-session.entity';
import { IChatSessionRepository, SessionFilters } from '../../../domain/repositories/chat-session.repository.interface';
import { ChatSessionDocument } from '../schemas/chat-session.schema';

/**
 * Repository Implementation: MongoChatSessionRepository
 * Implementa la persistencia de sesiones de chat usando MongoDB
 */
@Injectable()
export class MongoChatSessionRepository implements IChatSessionRepository {
  constructor(
    @InjectModel('ChatSession') private readonly sessionModel: Model<ChatSessionDocument>
  ) {}

  async findById(id: string): Promise<ChatSession | null> {
    const sessionDoc = await this.sessionModel.findById(id).exec();
    return sessionDoc ? this.toDomain(sessionDoc) : null;
  }

  async findByUserId(userId: string): Promise<ChatSession[]> {
    const sessionDocs = await this.sessionModel
      .find({ userId })
      .sort({ startedAt: -1 })
      .exec();
    return sessionDocs.map(doc => this.toDomain(doc));
  }

  async findActiveByUserId(userId: string): Promise<ChatSession | null> {
    const sessionDoc = await this.sessionModel
      .findOne({ userId, isActive: true })
      .exec();
    return sessionDoc ? this.toDomain(sessionDoc) : null;
  }

  async findBySessionToken(token: string): Promise<ChatSession | null> {
    const sessionDoc = await this.sessionModel
      .findOne({ sessionToken: token })
      .exec();
    return sessionDoc ? this.toDomain(sessionDoc) : null;
  }

  async create(session: ChatSession): Promise<ChatSession> {
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

  async update(id: string, sessionData: Partial<ChatSession>): Promise<ChatSession> {
    const updateData: any = {};
    
    if (sessionData.isActive !== undefined) updateData.isActive = sessionData.isActive;
    if (sessionData.endedAt !== undefined) updateData.endedAt = sessionData.endedAt;
    if (sessionData.metadata) updateData.metadata = sessionData.metadata;
    
    const updatedDoc = await this.sessionModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedDoc) {
      throw new Error('Sesión no encontrada');
    }

    return this.toDomain(updatedDoc);
  }

  async endSession(id: string): Promise<boolean> {
    const result = await this.sessionModel.findByIdAndUpdate(
      id,
      { 
        isActive: false, 
        endedAt: new Date() 
      },
      { new: true }
    ).exec();

    return !!result;
  }

  async findActiveSessions(): Promise<ChatSession[]> {
    const sessionDocs = await this.sessionModel
      .find({ isActive: true })
      .sort({ startedAt: -1 })
      .exec();
    return sessionDocs.map(doc => this.toDomain(doc));
  }

  async findExpiredSessions(maxDurationMs: number): Promise<ChatSession[]> {
    const expiryDate = new Date(Date.now() - maxDurationMs);
    const sessionDocs = await this.sessionModel
      .find({ 
        isActive: true,
        startedAt: { $lt: expiryDate }
      })
      .exec();
    return sessionDocs.map(doc => this.toDomain(doc));
  }

  async deleteSession(id: string): Promise<boolean> {
    const result = await this.sessionModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findSessionsByDateRange(from: Date, to: Date): Promise<ChatSession[]> {
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

  async countActiveSessionsForUser(userId: string): Promise<number> {
    return await this.sessionModel.countDocuments({ 
      userId, 
      isActive: true 
    }).exec();
  }

  private buildQuery(filters?: SessionFilters): any {
    const query: any = {};

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

  private toDomain(sessionDoc: ChatSessionDocument): ChatSession {
    return ChatSession.create({
      id: (sessionDoc._id as any).toString(),
      userId: sessionDoc.userId,
      sessionToken: sessionDoc.sessionToken,
      metadata: sessionDoc.metadata
    });
  }
}