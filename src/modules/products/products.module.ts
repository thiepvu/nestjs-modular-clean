import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSchema } from './infrastructure/persistence/product.schema';
import { ProductRepository } from './infrastructure/persistence/product.repository';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { ProductsController } from './presentation/controllers/products.controller';

/**
 * Products Module
 * Encapsulates all product-related functionality
 * Uses TypeORM Schema (EntitySchema) instead of decorators on domain entity
 */
@Module({
  imports: [TypeOrmModule.forFeature([ProductSchema])],
  controllers: [ProductsController],
  providers: [
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: CreateProductUseCase,
      useFactory: (productRepository: ProductRepository) => new CreateProductUseCase(productRepository),
      inject: ['IProductRepository'],
    },
    ProductRepository,
  ],
  exports: [ProductRepository],
})
export class ProductsModule {}