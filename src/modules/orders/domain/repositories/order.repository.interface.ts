import { IBaseRepository } from '@shared/domain/base.repository.interface';
import { Order, OrderStatus } from '../entities/order.entity';

/**
 * Order Repository Interface
 */
export interface IOrderRepository extends IBaseRepository<Order> {
  findByUserId(userId: string): Promise<Order[]>;
  findByStatus(status: OrderStatus): Promise<Order[]>;
  findByUserIdAndStatus(userId: string, status: OrderStatus): Promise<Order[]>;
}
