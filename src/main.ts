import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/presentation/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  const apiPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(apiPrefix);

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // CORS
  app.enableCors();

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Modular Monolith API')
    .setDescription('Clean Architecture Modular Monolith with NestJS, TypeORM, and Postgres')
    .setVersion('1.0')
    .addTag('Users', 'User management endpoints')
    .addTag('Products', 'Product management endpoints')
    .addTag('Orders', 'Order management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
    🚀 Application is running!
    
    📝 API Documentation: http://localhost:${port}/${apiPrefix}/docs
    🔗 API Endpoint: http://localhost:${port}/${apiPrefix}/v1
    
    Available Modules:
    - Users Module (Schema: ${process.env.DB_USERS_SCHEMA || 'users_schema'})
    - Products Module (Schema: ${process.env.DB_PRODUCTS_SCHEMA || 'products_schema'})
    - Orders Module (Schema: ${process.env.DB_ORDERS_SCHEMA || 'orders_schema'})
  `);
}

bootstrap();
