import { DataSource } from 'typeorm';

export class UsersSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const usersSchema = process.env.DB_USERS_SCHEMA || 'users_schema';
    
    await dataSource.query(`
      INSERT INTO ${usersSchema}.users (email, first_name, last_name, password, is_active)
      VALUES 
        ('john.doe@example.com', 'John', 'Doe', 'hashed_password_1', true),
        ('jane.smith@example.com', 'Jane', 'Smith', 'hashed_password_2', true),
        ('bob.johnson@example.com', 'Bob', 'Johnson', 'hashed_password_3', true),
        ('alice.williams@example.com', 'Alice', 'Williams', 'hashed_password_4', false)
      ON CONFLICT (email) DO NOTHING
    `);

    console.log('✓ Users seeded successfully');
  }
}
