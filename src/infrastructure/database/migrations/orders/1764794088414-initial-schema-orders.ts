import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration for orders module
 * Schema: orders_schema
 */
export class InitialSchemaOrders1764794088414 implements MigrationInterface {
  name = 'InitialSchemaOrders1764794088414';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create schema if not exists
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "orders_schema"`);

    await queryRunner.query(`CREATE TYPE "orders_schema"."orders_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')`);
    await queryRunner.query(`CREATE TABLE "orders_schema"."orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "product_id" character varying NOT NULL, "quantity" integer NOT NULL, "total_price" numeric(10,2) NOT NULL, "status" "orders_schema"."orders_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE "orders_schema"."orders_status_enum"`);
    await queryRunner.query(`DROP TABLE "orders_schema"."orders"`);
    
    // Note: We don't drop the schema in down migration to prevent data loss
    // await queryRunner.query(`DROP SCHEMA IF EXISTS "orders_schema" CASCADE`);
  }
}
