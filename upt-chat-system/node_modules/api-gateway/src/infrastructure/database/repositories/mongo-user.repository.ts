import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserType } from '../../../domain/entities/user.entity';
import { IUserRepository, UserFilters } from '../../../domain/repositories/user.repository.interface';
import { UserDocument } from '../schemas/user.schema';

/**
 * Repository Implementation: MongoUserRepository
 * Implementa la persistencia de usuarios usando MongoDB
 */
@Injectable()
export class MongoUserRepository implements IUserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>
  ) {}

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userModel.findById(id).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ 
      email: email.toLowerCase().trim() 
    }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async findAll(filters?: UserFilters): Promise<User[]> {
    const query = this.buildQuery(filters);
    const userDocs = await this.userModel.find(query).exec();
    return userDocs.map(doc => this.toDomain(doc));
  }

  async create(user: User): Promise<User> {
    const userDoc = new this.userModel({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });

    const savedDoc = await userDoc.save();
    return this.toDomain(savedDoc);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const updateData: any = {};
    
    if (userData.firstName) updateData.firstName = userData.firstName;
    if (userData.lastName) updateData.lastName = userData.lastName;
    if (userData.isActive !== undefined) updateData.isActive = userData.isActive;
    
    updateData.updatedAt = new Date();

    const updatedDoc = await this.userModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedDoc) {
      throw new Error('Usuario no encontrado');
    }

    return this.toDomain(updatedDoc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userModel.countDocuments({ 
      email: email.toLowerCase().trim() 
    }).exec();
    return count > 0;
  }

  async findActiveUsers(): Promise<User[]> {
    const userDocs = await this.userModel.find({ isActive: true }).exec();
    return userDocs.map(doc => this.toDomain(doc));
  }

  async countByUserType(userType: string): Promise<number> {
    return await this.userModel.countDocuments({ userType }).exec();
  }

  private buildQuery(filters?: UserFilters): any {
    const query: any = {};

    if (filters) {
      if (filters.userType) {
        query.userType = filters.userType;
      }

      if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
      }

      if (filters.createdAfter) {
        query.createdAt = { ...query.createdAt, $gte: filters.createdAfter };
      }

      if (filters.createdBefore) {
        query.createdAt = { ...query.createdAt, $lte: filters.createdBefore };
      }

      if (filters.searchTerm) {
        query.$text = { $search: filters.searchTerm };
      }
    }

    return query;
  }

  private toDomain(userDoc: UserDocument): User {
    return User.create({
      id: (userDoc._id as any).toString(),
      email: userDoc.email,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      userType: userDoc.userType as UserType
    });
  }
}