import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration for products module
 * Schema: products_schema
 */
export class InitialSchemaProducts1764794088462 implements MigrationInterface {
  name = 'InitialSchemaProducts1764794088462';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create schema if not exists
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "products_schema"`);

    await queryRunner.query(`CREATE TABLE "products_schema"."products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "sku" character varying NOT NULL, "is_available" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products_schema"."products"`);
    
    // Note: We don't drop the schema in down migration to prevent data loss
    // await queryRunner.query(`DROP SCHEMA IF EXISTS "products_schema" CASCADE`);
  }
}
