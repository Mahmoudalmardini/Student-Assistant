import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, AccountsController],
  providers: [UsersService, AccountsService],
  exports: [UsersService, AccountsService, TypeOrmModule],
})
export class UsersModule {}
