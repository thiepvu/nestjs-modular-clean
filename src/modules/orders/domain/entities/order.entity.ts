import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@shared/domain/base.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

/**
 * Order Domain Entity
 * Note: We store userId and productId as references, not actual relations
 * This maintains module independence in a modular monolith
 */
@Entity({ schema: process.env.DB_ORDERS_SCHEMA || 'orders_schema', name: 'orders' })
export class Order extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string; // Reference to User in Users module

  @Column({ name: 'product_id' })
  productId: string; // Reference to Product in Products module

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'total_price' })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;
}