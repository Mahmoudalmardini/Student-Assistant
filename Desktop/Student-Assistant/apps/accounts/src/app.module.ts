import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AccountsModule } from './accounts/accounts.module';
import { SuperAdminSeeder } from './database/seeders/super-admin.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    AccountsModule,
  ],
  providers: [SuperAdminSeeder],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly superAdminSeeder: SuperAdminSeeder) {}

  async onModuleInit() {
    // Seed super admin on application startup
    await this.superAdminSeeder.seed();
  }
}

