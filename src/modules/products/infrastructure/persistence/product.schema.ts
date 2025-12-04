import { EntitySchema } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';

/**
 * TypeORM Schema for Product Entity
 * Maps pure domain entity to database
 * This is in infrastructure layer - domain stays clean
 */
export const ProductSchema = new EntitySchema<Product>({
  name: 'Product',
  tableName: 'products',
  schema: process.env.DB_PRODUCTS_SCHEMA || 'products_schema',
  target: Product,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
    },
    description: {
      type: 'text',
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
    },
    stock: {
      type: 'int',
      default: 0,
    },
    sku: {
      type: 'varchar',
      unique: true,
    },
    isAvailable: {
      type: 'boolean',
      name: 'is_available',
      default: true,
    },
    createdAt: {
      type: 'timestamp',
      name: 'created_at',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      name: 'updated_at',
      updateDate: true,
    },
  },
  indices: [
    {
      name: 'IDX_PRODUCT_SKU',
      columns: ['sku'],
    },
    {
      name: 'IDX_PRODUCT_IS_AVAILABLE',
      columns: ['isAvailable'],
    },
  ],
});