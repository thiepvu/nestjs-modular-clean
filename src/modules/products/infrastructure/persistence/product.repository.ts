import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { BaseRepositoryImpl } from '@shared/infrastructure/base.repository.impl';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';

/**
 * Product Repository Implementation
 */
@Injectable()
export class ProductRepository extends BaseRepositoryImpl<Product> implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(productRepository);
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { sku } });
  }

  async findAvailableProducts(): Promise<Product[]> {
    return this.productRepository.find({ 
      where: { isAvailable: true, stock: Between(1, 999999) } 
    });
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        price: Between(minPrice, maxPrice),
      },
    });
  }
}
