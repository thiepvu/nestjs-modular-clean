import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UnitOfWork } from '@shared/infrastructure/unit-of-work.impl';
import { User } from '@modules/users/domain/entities/user.entity';
import { Product } from '@modules/products/domain/entities/product.entity';
import { Order } from '@modules/orders/domain/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Product, Order],
        synchronize: false, // Always false in production
        logging: configService.get('NODE_ENV') === 'development',
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: false,
      }),
      dataSourceFactory: async (options?: DataSourceOptions) => {
        if (!options) {
          throw new Error("DataSourceOptions is undefined. Check your TypeORM config.");
        }
        return new DataSource(options).initialize();
      },
    }),
  ],
  providers: [UnitOfWork],
  exports: [UnitOfWork],
})
export class DatabaseModule {}