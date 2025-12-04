import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration for orders module
 * Schema: orders_schema
 */
export class AddOrderMinPriceOrders1764825399561 implements MigrationInterface {
  name = 'AddOrderMinPriceOrders1764825399561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create schema if not exists
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "orders_schema"`);

    await queryRunner.query(`ALTER TABLE "orders_schema"."orders" ADD "min_price" numeric(10,2) NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders_schema"."orders" DROP COLUMN "min_price"`);
    
    // Note: We don't drop the schema in down migration to prevent data loss
    // await queryRunner.query(`DROP SCHEMA IF EXISTS "orders_schema" CASCADE`);
  }
}
