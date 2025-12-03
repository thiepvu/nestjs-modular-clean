import { DataSource } from 'typeorm';
import { BaseSeeder } from '@infrastructure/database/seeders/base.seeder';
import { User } from '../../domain/entities/user.entity';

/**
 * User Seeder
 * Seeds initial users for development/testing
 */
export class UserSeeder extends BaseSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = this.getRepository<User>(dataSource, User);

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await this.clearTable(dataSource, 'users', 'users_schema');

    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      this.log(`⏭️  Skipping - ${existingUsers} user(s) already exist`);
      return;
    }

    // Seed users
    const users = [
      {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123', // In production, this should be hashed!
        isActive: true,
      },
      {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'password123',
        isActive: true,
      },
      {
        email: 'bob.johnson@example.com',
        firstName: 'Bob',
        lastName: 'Johnson',
        password: 'password123',
        isActive: true,
      },
      {
        email: 'alice.williams@example.com',
        firstName: 'Alice',
        lastName: 'Williams',
        password: 'password123',
        isActive: false,
      },
    ];

    const createdUsers = await userRepository.save(users);
    
    this.log(`✓ Created ${createdUsers.length} users`);
    createdUsers.forEach(user => {
      this.log(`  - ${user.email} (${user.firstName} ${user.lastName})`);
    });
  }
}