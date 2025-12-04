import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { BaseUseCase } from '@shared/application/base.use-case';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { UserRepository } from '@modules/users/infrastructure/persistence/user.repository';
import { ProductRepository } from '@modules/products/infrastructure/persistence/product.repository';
import { UnitOfWork } from '@shared/infrastructure/unit-of-work.impl';

interface CreateOrderInput {
  userId: string;
  productId: string;
  quantity: number;
}

/**
 * Create Order Use Case
 * Demonstrates cross-module communication and transaction management
 */
@Injectable()
export class CreateOrderUseCase extends BaseUseCase<CreateOrderInput, Order> {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {
    super();
  }

  async execute(input: CreateOrderInput): Promise<Order> {
    // Validate user exists
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate product exists and has sufficient stock
    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < input.quantity) {
      throw new BadRequestException('Insufficient product stock');
    }

    // Use Unit of Work to manage transaction across multiple operations
    return this.unitOfWork.withTransaction(async () => {
      // Update product stock
      await this.productRepository.update(input.productId, {
        stock: product.stock - input.quantity,
      });

      // Create order
      const totalPrice = product.price * input.quantity;
      return this.orderRepository.create({
        userId: input.userId,
        productId: input.productId,
        quantity: input.quantity,
        totalPrice,
        status: OrderStatus.PENDING,
      });
    });
  }
}