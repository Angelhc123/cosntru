import { Document } from 'mongoose';
import type { SessionMetadata } from '../../../domain/entities/chat-session.entity';
export declare class ChatSessionDocument extends Document {
    userId: string;
    sessionToken: string;
    isActive: boolean;
    startedAt: Date;
    endedAt: Date;
    metadata: SessionMetadata;
    get duration(): number | null;
    get status(): string;
}
export declare const ChatSessionSchema: import("mongoose").Schema<ChatSessionDocument, import("mongoose").Model<ChatSessionDocument, any, any, any, Document<unknown, any, ChatSessionDocument, any, {}> & ChatSessionDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatSessionDocument, Document<unknown, {}, import("mongoose").FlatRecord<ChatSessionDocument>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ChatSessionDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
