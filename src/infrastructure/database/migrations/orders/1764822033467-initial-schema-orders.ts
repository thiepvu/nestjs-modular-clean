import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration for orders module
 * Schema: orders_schema
 */
export class InitialSchemaOrders1764822033467 implements MigrationInterface {
  name = 'InitialSchemaOrders1764822033467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create schema if not exists
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "orders_schema"`);

    await queryRunner.query(`CREATE TYPE "orders_schema"."orders_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')`);
    await queryRunner.query(`CREATE TABLE "orders_schema"."orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "product_id" uuid NOT NULL, "quantity" integer NOT NULL, "total_price" numeric(10,2) NOT NULL, "status" "orders_schema"."orders_status_enum" NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_ORDER_USER_ID" ON "orders_schema"."orders" ("user_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_ORDER_PRODUCT_ID" ON "orders_schema"."orders" ("product_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_ORDER_STATUS" ON "orders_schema"."orders" ("status") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE "orders_schema"."orders_status_enum"`);
    await queryRunner.query(`DROP TABLE "orders_schema"."orders"`);
    await queryRunner.query(`DROP INDEX "orders_schema"."IDX_ORDER_USER_ID"`);
    await queryRunner.query(`DROP INDEX "orders_schema"."IDX_ORDER_PRODUCT_ID"`);
    await queryRunner.query(`DROP INDEX "orders_schema"."IDX_ORDER_STATUS"`);
    
    // Note: We don't drop the schema in down migration to prevent data loss
    // await queryRunner.query(`DROP SCHEMA IF EXISTS "orders_schema" CASCADE`);
  }
}
