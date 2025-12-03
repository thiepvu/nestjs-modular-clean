import { DataSource } from 'typeorm';
import { BaseSeeder } from '@infrastructure/database/seeders/base.seeder';
import { Product } from '../../domain/entities/product.entity';

/**
 * Product Seeder
 * Seeds initial products for development/testing
 */
export class ProductSeeder extends BaseSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const productRepository = this.getRepository<Product>(dataSource, Product);

    // Check if products already exist
    const existingProducts = await productRepository.count();
    if (existingProducts > 0) {
      this.log(`⏭️  Skipping - ${existingProducts} product(s) already exist`);
      return;
    }

    // Seed products
    const products = [
      {
        name: 'MacBook Pro 16"',
        description: 'Powerful laptop for developers and creators',
        price: 2499.99,
        stock: 50,
        sku: 'MBP-16-2024',
        isAvailable: true,
      },
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with A17 Pro chip',
        price: 1199.99,
        stock: 100,
        sku: 'IPH-15-PRO',
        isAvailable: true,
      },
      {
        name: 'AirPods Pro (2nd generation)',
        description: 'Active noise cancellation wireless earbuds',
        price: 249.99,
        stock: 200,
        sku: 'APP-2ND-GEN',
        isAvailable: true,
      },
      {
        name: 'iPad Air',
        description: 'Versatile tablet for work and play',
        price: 599.99,
        stock: 75,
        sku: 'IPAD-AIR-2024',
        isAvailable: true,
      },
      {
        name: 'Apple Watch Ultra 2',
        description: 'Adventure-ready smartwatch',
        price: 799.99,
        stock: 0,
        sku: 'AW-ULTRA-2',
        isAvailable: false,
      },
    ];

    const createdProducts = await productRepository.save(products);
    
    this.log(`✓ Created ${createdProducts.length} products`);
    createdProducts.forEach(product => {
      this.log(`  - ${product.name} ($${product.price}) - Stock: ${product.stock}`);
    });
  }
}