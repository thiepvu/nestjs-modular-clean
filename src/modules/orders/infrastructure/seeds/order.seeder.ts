import { DataSource } from 'typeorm';
import { BaseSeeder } from '@infrastructure/database/seeders/base.seeder';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { User } from '@modules/users/domain/entities/user.entity';
import { Product } from '@modules/products/domain/entities/product.entity';

/**
 * Order Seeder
 * Seeds initial orders for development/testing
 * Depends on: UserSeeder, ProductSeeder (must run after them)
 */
export class OrderSeeder extends BaseSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const orderRepository = this.getRepository<Order>(dataSource, Order);
    const userRepository = this.getRepository<User>(dataSource, User);
    const productRepository = this.getRepository<Product>(dataSource, Product);

    // Check if orders already exist
    const existingOrders = await orderRepository.count();
    if (existingOrders > 0) {
      this.log(`⏭️  Skipping - ${existingOrders} order(s) already exist`);
      return;
    }

    // Get existing users and products
    const users = await userRepository.find({ take: 3 });
    const products = await productRepository.find({ take: 4 });

    if (users.length === 0 || products.length === 0) {
      this.log('⚠️  No users or products found. Run UserSeeder and ProductSeeder first!');
      return;
    }

    // Seed orders
    const orders = [
      {
        userId: users[0].id,
        productId: products[0].id,
        quantity: 1,
        totalPrice: products[0].price * 1,
        status: OrderStatus.DELIVERED,
      },
      {
        userId: users[0].id,
        productId: products[1].id,
        quantity: 2,
        totalPrice: products[1].price * 2,
        status: OrderStatus.SHIPPED,
      },
      {
        userId: users[1].id,
        productId: products[2].id,
        quantity: 1,
        totalPrice: products[2].price * 1,
        status: OrderStatus.CONFIRMED,
      },
      {
        userId: users[1].id,
        productId: products[3].id,
        quantity: 1,
        totalPrice: products[3].price * 1,
        status: OrderStatus.PENDING,
      },
      {
        userId: users[2].id,
        productId: products[0].id,
        quantity: 1,
        totalPrice: products[0].price * 1,
        status: OrderStatus.CANCELLED,
      },
    ];

    const createdOrders = await orderRepository.save(orders);
    
    this.log(`✓ Created ${createdOrders.length} orders`);
    createdOrders.forEach(order => {
      this.log(`  - Order #${order.id} - Status: ${order.status} - Total: $${order.totalPrice}`);
    });
  }
}