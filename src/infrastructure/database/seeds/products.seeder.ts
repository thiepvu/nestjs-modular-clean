import { DataSource } from 'typeorm';

export class ProductsSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const productsSchema = process.env.DB_PRODUCTS_SCHEMA || 'products_schema';
    
    await dataSource.query(`
      INSERT INTO ${productsSchema}.products (name, description, price, stock, sku, is_available)
      VALUES 
        ('MacBook Pro', 'High-performance laptop for professionals', 1999.99, 50, 'MBP-2024-001', true),
        ('iPhone 15 Pro', 'Latest iPhone with advanced features', 1199.99, 100, 'IPH-2024-001', true),
        ('AirPods Pro', 'Premium wireless earbuds', 249.99, 200, 'AIP-2024-001', true),
        ('iPad Air', 'Versatile tablet for work and play', 599.99, 75, 'IPA-2024-001', true),
        ('Apple Watch Ultra', 'Advanced smartwatch for athletes', 799.99, 30, 'AWU-2024-001', true)
      ON CONFLICT (sku) DO NOTHING
    `);

    console.log('✓ Products seeded successfully');
  }
}
