import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import { AppAccountsModule } from './app-accounts.module';
import { SuperAdminSeeder } from './database/seeders/super-admin.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppAccountsModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: configService.get('CORS_ORIGIN')?.split(',') || ['http://localhost:4200'],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Seed super admin account
  try {
    const superAdminSeeder = app.get(SuperAdminSeeder);
    await superAdminSeeder.seed();
  } catch (error) {
    console.error('Error seeding super admin:', error);
  }

  // API Documentation
  const config = new DocumentBuilder()
    .setTitle('Student Assistant System API')
    .setDescription('API for managing university student transportation and assistance')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
