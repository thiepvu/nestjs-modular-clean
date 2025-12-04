import { EntitySchema } from 'typeorm';
import { Order, OrderStatus } from '../../domain/entities/order.entity';

/**
 * TypeORM Schema for Order Entity
 * Maps pure domain entity to database
 * This is in infrastructure layer - domain stays clean
 */
export const OrderSchema = new EntitySchema<Order>({
  name: 'Order',
  tableName: 'orders',
  schema: process.env.DB_ORDERS_SCHEMA || 'orders_schema',
  target: Order,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    userId: {
      type: 'uuid',
      name: 'user_id',
    },
    productId: {
      type: 'uuid',
      name: 'product_id',
    },
    quantity: {
      type: 'int',
    },
    totalPrice: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      name: 'total_price',
    },
    status: {
      type: 'enum',
      enum: OrderStatus,
      default: OrderStatus.PENDING,
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
      name: 'IDX_ORDER_USER_ID',
      columns: ['userId'],
    },
    {
      name: 'IDX_ORDER_PRODUCT_ID',
      columns: ['productId'],
    },
    {
      name: 'IDX_ORDER_STATUS',
      columns: ['status'],
    },
  ],
});