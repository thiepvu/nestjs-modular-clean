import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersSchema1733238000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const productsSchema = process.env.DB_PRODUCTS_SCHEMA || 'products_schema';

    // Create schema
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS ${productsSchema}`);

    // Create products table
    await queryRunner.query(`
      CREATE TABLE ${productsSchema}.products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER DEFAULT 0,
        sku VARCHAR(100) NOT NULL UNIQUE,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX idx_products_sku ON ${productsSchema}.products(sku)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_products_is_available ON ${productsSchema}.products(is_available)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_products_price ON ${productsSchema}.products(price)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const productsSchema = process.env.DB_PRODUCTS_SCHEMA || 'products_schema';
    await queryRunner.query(`DROP SCHEMA IF EXISTS ${productsSchema} CASCADE`);
  }
}
