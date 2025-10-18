import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import { UserRole } from '../common/interfaces/user.interface';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username: username.toLowerCase() });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<UserDocument> {
    const user = new this.userModel({
      ...userData,
      username: userData.username.toLowerCase(),
      email: userData.email.toLowerCase(),
      isEmailVerified: true, // Auto-verify for accounts created by admin
    });
    return user.save();
  }

  async findAll(filter: any = {}): Promise<UserDocument[]> {
    return this.userModel
      .find(filter)
      .select('-password -emailVerificationToken -passwordResetToken')
      .exec();
  }

  async updateUser(id: string, updateData: any): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
      .select('-password -emailVerificationToken -passwordResetToken');
  }

  async deleteUser(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id);
  }

  async countByRole(role: UserRole): Promise<number> {
    return this.userModel.countDocuments({ role });
  }
}

