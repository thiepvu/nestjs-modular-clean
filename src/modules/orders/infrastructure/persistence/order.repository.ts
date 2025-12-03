import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepositoryImpl } from '@shared/infrastructure/base.repository.impl';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';

/**
 * Order Repository Implementation
 */
@Injectable()
export class OrderRepository extends BaseRepositoryImpl<Order> implements IOrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    super(orderRepository);
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.find({ where: { userId } });
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.find({ where: { status } });
  }

  async findByUserIdAndStatus(userId: string, status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.find({ where: { userId, status } });
  }
}
