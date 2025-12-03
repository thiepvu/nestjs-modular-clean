import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domain/entities/product.entity';
import { ProductRepository } from './infrastructure/persistence/product.repository';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { ProductsController } from './presentation/controllers/products.controller';

/**
 * Products Module
 * Encapsulates all product-related functionality
 */
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
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
