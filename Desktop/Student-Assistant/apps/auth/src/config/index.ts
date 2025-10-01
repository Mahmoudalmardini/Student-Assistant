import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

export const AppConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [configuration],
});
// This module loads environment variables and makes them available throughout the application.