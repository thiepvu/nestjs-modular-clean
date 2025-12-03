import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { GlobalExceptionFilter } from './shared/presentation/filters/global-exception.filter';

/**
 * Main Application Module
 * Imports all feature modules and configures global settings
 */
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Infrastructure
    DatabaseModule,

    // Feature Modules
    UsersModule,
    ProductsModule,
    OrdersModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
