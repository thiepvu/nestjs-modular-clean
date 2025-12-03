import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UnitOfWork } from '@shared/infrastructure/unit-of-work.impl';
import { User } from '@modules/users/domain/entities/user.entity';
import { Product } from '@modules/products/domain/entities/product.entity';
import { Order } from '@modules/orders/domain/entities/order.entity';

/**
 * Database Module with Entity Management
 * 
 * Uses explicit imports for reliability in production.
 * Auto-scanning is available via CLI tools for migrations.
 * 
 * To add a new entity:
 * 1. Create entity in your module's domain/entities folder
 * 2. Import it here: import { MyEntity } from '@modules/mymodule/domain/entities/my.entity'
 * 3. Add to entities array below
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
        // Use explicit entity imports for reliability
        const entities = [User, Product, Order];

        console.log(`📦 Loaded ${entities.length} entities`);

        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities,
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