import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './core/users/users.module';
import { SuperAdminSeeder } from './database/seeders/super-admin.seeder';
import { User } from './core/users/entities/user.entity';
import { College } from './core/academic/entities/college.entity';
import { Bus } from './core/transportation/entities/bus.entity';
import { Route } from './core/transportation/entities/route.entity';
import { BusRoute } from './core/transportation/entities/bus-route.entity';
import { BusLocation } from './core/tracking/entities/bus-location.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5434'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'student_assistant',
      entities: [User, College, Bus, Route, BusRoute, BusLocation],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, SuperAdminSeeder],
})
export class AppModule {}
