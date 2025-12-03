import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@shared/domain/base.entity';

/**
 * Product Domain Entity
 */
@Entity({ schema: process.env.DB_PRODUCTS_SCHEMA || 'products_schema', name: 'products' })
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column()
  sku: string;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;
}