import { Model } from 'mongoose';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository, UserFilters } from '../../../domain/repositories/user.repository.interface';
import { UserDocument } from '../schemas/user.schema';
export declare class MongoUserRepository implements IUserRepository {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(filters?: UserFilters): Promise<User[]>;
    create(user: User): Promise<User>;
    update(id: string, userData: Partial<User>): Promise<User>;
    delete(id: string): Promise<boolean>;
    existsByEmail(email: string): Promise<boolean>;
    findActiveUsers(): Promise<User[]>;
    countByUserType(userType: string): Promise<number>;
    private buildQuery;
    private toDomain;
}
