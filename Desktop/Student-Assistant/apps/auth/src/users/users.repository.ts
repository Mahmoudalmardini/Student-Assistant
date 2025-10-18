import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../common/abstract.repository';
import { User, UserDocument } from './schemas/user.schema';
import { UserRole } from '../common/interfaces/auth.interface';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    super(userModel);
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.findOne({ username: username.toLowerCase() });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.findOne({ _id: id });
  }

  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<UserDocument> {
    const user = new this.userModel({
      ...userData,
      username: userData.username.toLowerCase(),
      email: userData.email.toLowerCase(),
    });
    return user.save();
  }

  async updateLoginAttempts(username: string, attempts: number, lockUntil?: Date): Promise<void> {
    const updateData: any = { loginAttempts: attempts };
    if (lockUntil) {
      updateData.lockUntil = lockUntil;
    } else {
      updateData.$unset = { lockUntil: 1 };
    }
    
    await this.userModel.updateOne({ username: username.toLowerCase() }, updateData);
  }

  async resetLoginAttempts(username: string): Promise<void> {
    await this.userModel.updateOne(
      { username: username.toLowerCase() },
      { 
        $unset: { loginAttempts: 1, lockUntil: 1 },
        $set: { lastLogin: new Date() }
      }
    );
  }

  async setEmailVerificationToken(email: string, token: string): Promise<void> {
    await this.userModel.updateOne(
      { email: email.toLowerCase() },
      { emailVerificationToken: token }
    );
  }

  async verifyEmail(token: string): Promise<UserDocument | null> {
    return this.userModel.findOneAndUpdate(
      { emailVerificationToken: token },
      { 
        $unset: { emailVerificationToken: 1 },
        $set: { isEmailVerified: true }
      },
      { new: true }
    );
  }

  async setPasswordResetToken(email: string, token: string, expires: Date): Promise<void> {
    await this.userModel.updateOne(
      { email: email.toLowerCase() },
      { 
        passwordResetToken: token,
        passwordResetExpires: expires
      }
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<UserDocument | null> {
    return this.userModel.findOneAndUpdate(
      { 
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() }
      },
      { 
        $unset: { passwordResetToken: 1, passwordResetExpires: 1 },
        $set: { password: newPassword }
      },
      { new: true }
    );
  }

  async findAll(filter: any = {}): Promise<UserDocument[]> {
    return this.userModel.find(filter).select('-password -emailVerificationToken -passwordResetToken').exec();
  }

  async updateUser(id: string, updateData: any): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -passwordResetToken');
  }

  async deleteUser(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id);
  }

  async countByRole(role: UserRole): Promise<number> {
    return this.userModel.countDocuments({ role });
  }
}
