import { Document } from 'mongoose';
export declare class MessageDocument extends Document {
    sessionId: string;
    sender: string;
    text: string;
    timestamp: Date;
    metadata: Record<string, any>;
    feedback: string | null;
    feedbackTimestamp: Date | null;
}
export declare const MessageSchema: import("mongoose").Schema<MessageDocument, import("mongoose").Model<MessageDocument, any, any, any, Document<unknown, any, MessageDocument, any, {}> & MessageDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MessageDocument, Document<unknown, {}, import("mongoose").FlatRecord<MessageDocument>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<MessageDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
