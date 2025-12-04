import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UnitOfWork } from '@shared/infrastructure/unit-of-work.impl';
import { EntitySchemas } from './entity-schemas.registry';

/**
 * Database Module with Clean Architecture
 * 
 * Uses EntitySchemas instead of decorator-based entities
 * This keeps the domain layer pure and free from infrastructure concerns
 * 
 * To add a new entity:
 * 1. Create pure domain entity in modules/{module}/domain/entities/
 * 2. Create EntitySchema in modules/{module}/infrastructure/persistence/
 * 3. Add schema to entity-schemas.registry.ts
 * 
 * Migration Structure:
 * - Each module has its own migration folder: /migrations/{moduleName}/
 * - Each module uses its own schema
 * - Migrations are tracked separately per module
 * 
 * CLI Commands:
 * - Generate migration for specific module:
 *   npm run migration:generate -- --name=CreateUserTable --module=users
 * 
 * - Generate migrations for all modules:
 *   npm run migration:generate -- --name=InitialSchema --all
 * 
 * - Run migrations for specific module:
 *   npm run migration:run -- --module=users
 * 
 * - Run migrations for all modules:
 *   npm run migration:run -- --all
 * 
 * - Check migration status:
 *   npm run migration:status -- --all
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(`📦 Loaded ${EntitySchemas.length} entity schemas`);

        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: EntitySchemas,
          synchronize: false, // Always false - use migrations
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
      dataSourceFactory: async (options?: DataSourceOptions) => {
        if (!options) {
          throw new Error('DataSourceOptions is undefined. Check your TypeORM config.');
        }
        return new DataSource(options).initialize();
      },
    }),
  ],
  providers: [UnitOfWork],
  exports: [UnitOfWork],
})
export class DatabaseModule {}