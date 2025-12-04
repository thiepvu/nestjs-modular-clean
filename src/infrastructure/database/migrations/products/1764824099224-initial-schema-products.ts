import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration for products module
 * Schema: products_schema
 */
export class InitialSchemaProducts1764824099224 implements MigrationInterface {
  name = 'InitialSchemaProducts1764824099224';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create schema if not exists
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "products_schema"`);

    await queryRunner.query(`CREATE TABLE "products_schema"."products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "sku" character varying NOT NULL, "is_available" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_PRODUCT_SKU" ON "products_schema"."products" ("sku") `);
    await queryRunner.query(`CREATE INDEX "IDX_PRODUCT_IS_AVAILABLE" ON "products_schema"."products" ("is_available") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products_schema"."products"`);
    await queryRunner.query(`DROP INDEX "products_schema"."IDX_PRODUCT_SKU"`);
    await queryRunner.query(`DROP INDEX "products_schema"."IDX_PRODUCT_IS_AVAILABLE"`);
    
    // Note: We don't drop the schema in down migration to prevent data loss
    // await queryRunner.query(`DROP SCHEMA IF EXISTS "products_schema" CASCADE`);
  }
}
