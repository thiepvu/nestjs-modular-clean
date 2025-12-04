import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration for users module
 * Schema: users_schema
 */
export class InitialSchemaUsers1764824099258 implements MigrationInterface {
  name = 'InitialSchemaUsers1764824099258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create schema if not exists
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "users_schema"`);

    await queryRunner.query(`CREATE TABLE "users_schema"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "password" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_USER_EMAIL" ON "users_schema"."users" ("email") `);
    await queryRunner.query(`CREATE INDEX "IDX_USER_IS_ACTIVE" ON "users_schema"."users" ("is_active") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users_schema"."users"`);
    await queryRunner.query(`DROP INDEX "users_schema"."IDX_USER_EMAIL"`);
    await queryRunner.query(`DROP INDEX "users_schema"."IDX_USER_IS_ACTIVE"`);
    
    // Note: We don't drop the schema in down migration to prevent data loss
    // await queryRunner.query(`DROP SCHEMA IF EXISTS "users_schema" CASCADE`);
  }
}
