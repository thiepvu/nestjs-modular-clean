import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './domain/entities/order.entity';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { UsersModule } from '@modules/users/users.module';
import { ProductsModule } from '@modules/products/products.module';
import { DatabaseModule } from '@infrastructure/database/database.module';

/**
 * Orders Module
 * Demonstrates cross-module dependencies
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UsersModule,
    ProductsModule,
    DatabaseModule,
  ],
  providers: [
    OrderRepository,
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
    CreateOrderUseCase,
  ],
  exports: [OrderRepository, 'IOrderRepository'],
})
export class OrdersModule {}