import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../common/interfaces/user.interface';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-zA-Z0-9_]+$/
  })
  username: string;

  @Prop({ required: true })
  password: string; // hashed

  @Prop({ 
    required: true, 
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  })
  email: string;

  @Prop({ 
    enum: Object.values(UserRole), 
    default: UserRole.STUDENT 
  })
  role: UserRole;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop()
  lockUntil?: Date;

  @Prop({ default: Date.now })
  lastLogin?: Date;

  // Virtual for account locked status
  get isLocked(): boolean {
    return !!(this.lockUntil && this.lockUntil > new Date());
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtual fields
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.emailVerificationToken;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  }
});

