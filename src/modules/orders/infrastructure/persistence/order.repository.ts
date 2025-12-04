import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { OrderSchema } from './order.schema';

/**
 * Order Repository Implementation
 * Infrastructure layer - implements domain repository interface
 * Uses TypeORM but domain layer doesn't know about it
 */
@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderSchema)
    private readonly repository: Repository<Order>,
  ) {}

  async findById(id: string): Promise<Order | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async findOne(criteria: Partial<Order>): Promise<Order | null> {
    return this.repository.findOne({ where: criteria as any });
  }

  async findAll(criteria?: Partial<Order>, options?: any): Promise<Order[]> {
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

  async create(data: Partial<Order>): Promise<Order> {
    const order = this.repository.create(data as any);
    const saved = await this.repository.save(order);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async update(id: string, data: Partial<Order>): Promise<Order> {
    await this.repository.update(id, data as any);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Order with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(criteria?: Partial<Order>): Promise<number> {
    if (criteria) {
      return this.repository.count({ where: criteria as any });
    }
    return this.repository.count();
  }

  async exists(criteria: Partial<Order>): Promise<boolean> {
    const count = await this.repository.count({ where: criteria as any });
    return count > 0;
  }

  // Order-specific methods
  async findByUserId(userId: string): Promise<Order[]> {
    return this.repository.find({ where: { userId } as any });
  }

  async findByProductId(productId: string): Promise<Order[]> {
    return this.repository.find({ where: { productId } as any });
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return this.repository.find({ where: { status } as any });
  }

  async findByUserIdAndStatus(userId: string, status: OrderStatus): Promise<Order[]> {
    return this.repository.find({ where: { userId, status } as any });
  }

  async findPendingOrders(): Promise<Order[]> {
    return this.repository.find({ where: { status: OrderStatus.PENDING } as any });
  }
}