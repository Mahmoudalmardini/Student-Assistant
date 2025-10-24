import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../users/entities/user.entity';
import { UserRole } from '../../common/enums/user-roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: [
        { username: identifier, isActive: true },
        { universityId: identifier, isActive: true }
      ],
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const identifier = user.username || user.universityId;
    const payload = {
      identifier: identifier,
      sub: user.id,
      role: user.role,
      collegeId: user.collegeId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        universityId: user.universityId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        collegeId: user.collegeId,
      },
    };
  }

  async register(createUserDto: any) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id, isActive: true },
    });
  }
}
