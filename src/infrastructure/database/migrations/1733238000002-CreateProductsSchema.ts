import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsSchema1733238000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const ordersSchema = process.env.DB_ORDERS_SCHEMA || 'orders_schema';

    // Create schema
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS ${ordersSchema}`);

    // Create order status enum type
    await queryRunner.query(`
      CREATE TYPE ${ordersSchema}.order_status AS ENUM (
        'PENDING',
        'CONFIRMED',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED'
      )
    `);

    // Create orders table
    await queryRunner.query(`
      CREATE TABLE ${ordersSchema}.orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        product_id UUID NOT NULL,
        quantity INTEGER NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        status ${ordersSchema}.order_status DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX idx_orders_user_id ON ${ordersSchema}.orders(user_id)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_orders_product_id ON ${ordersSchema}.orders(product_id)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_orders_status ON ${ordersSchema}.orders(status)
    `);

    await queryRunner.query(`
      CREATE INDEX idx_orders_user_status ON ${ordersSchema}.orders(user_id, status)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const ordersSchema = process.env.DB_ORDERS_SCHEMA || 'orders_schema';
    await queryRunner.query(`DROP SCHEMA IF EXISTS ${ordersSchema} CASCADE`);
  }
}
