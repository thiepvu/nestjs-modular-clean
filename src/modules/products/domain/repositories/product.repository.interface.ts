import { IBaseRepository } from '@shared/domain/base.repository.interface';
import { Product } from '../entities/product.entity';

/**
 * Product Repository Interface
 */
export interface IProductRepository extends IBaseRepository<Product> {
  findBySku(sku: string): Promise<Product | null>;
  findAvailableProducts(): Promise<Product[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
}
