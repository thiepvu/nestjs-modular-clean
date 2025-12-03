import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersSchema1733238000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersSchema = process.env.DB_USERS_SCHEMA || 'users_schema';

    // Create schema
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS ${usersSchema}`);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE ${usersSchema}.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on email
    await queryRunner.query(`
      CREATE INDEX idx_users_email ON ${usersSchema}.users(email)
    `);

    // Create index on is_active
    await queryRunner.query(`
      CREATE INDEX idx_users_is_active ON ${usersSchema}.users(is_active)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const usersSchema = process.env.DB_USERS_SCHEMA || 'users_schema';
    await queryRunner.query(`DROP SCHEMA IF EXISTS ${usersSchema} CASCADE`);
  }
}
