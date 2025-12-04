import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductSchema } from './product.schema';

/**
 * Product Repository Implementation
 * Infrastructure layer - implements domain repository interface
 * Uses TypeORM but domain layer doesn't know about it
 */
@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductSchema)
    private readonly repository: Repository<Product>,
  ) {}

  async findById(id: string): Promise<Product | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async findOne(criteria: Partial<Product>): Promise<Product | null> {
    return this.repository.findOne({ where: criteria as any });
  }

  async findAll(criteria?: Partial<Product>, options?: any): Promise<Product[]> {
    const findOptions: any = {};
    
    if (criteria) {
      findOptions.where = criteria;
    }
    
    if (options) {
      if (options.skip !== undefined) findOptions.skip = options.skip;
      if (options.take !== undefined) findOptions.take = options.take;
      if (options.order) findOptions.order = options.order;
    }
    
    return this.repository.find(findOptions);
  }

  async create(data: Partial<Product>): Promise<Product> {
    // Filter out undefined values to prevent empty strings
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
    
    const product = this.repository.create(cleanData);
    const saved = await this.repository.save(product);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    await this.repository.update(id, data as any);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Product with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(criteria?: Partial<Product>): Promise<number> {
    if (criteria) {
      return this.repository.count({ where: criteria as any });
    }
    return this.repository.count();
  }

  async exists(criteria: Partial<Product>): Promise<boolean> {
    const count = await this.repository.count({ where: criteria as any });
    return count > 0;
  }

  // Product-specific methods
  async findBySku(sku: string): Promise<Product | null> {
    return this.repository.findOne({ where: { sku } as any });
  }

  async findAvailableProducts(): Promise<Product[]> {
    return this.repository.find({ where: { isAvailable: true } as any });
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.repository
      .createQueryBuilder('product')
      .where('product.price >= :minPrice', { minPrice })
      .andWhere('product.price <= :maxPrice', { maxPrice })
      .getMany();
  }
}