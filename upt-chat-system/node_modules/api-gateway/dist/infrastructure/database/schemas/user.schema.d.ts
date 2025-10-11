import { Document } from 'mongoose';
import { UserType } from '../../../domain/entities/user.entity';
export declare class UserDocument extends Document {
    email: string;
    firstName: string;
    lastName: string;
    userType: UserType;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    get fullName(): string;
}
export declare const UserSchema: import("mongoose").Schema<UserDocument, import("mongoose").Model<UserDocument, any, any, any, Document<unknown, any, UserDocument, any, {}> & UserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserDocument, Document<unknown, {}, import("mongoose").FlatRecord<UserDocument>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<UserDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
