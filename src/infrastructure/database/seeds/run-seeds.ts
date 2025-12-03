import { AppDataSource } from '../data-source';
import { UsersSeeder } from './users.seeder';
import { ProductsSeeder } from './products.seeder';

async function runSeeds() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✓ Database connection established');

    const seeders = [
      new UsersSeeder(),
      new ProductsSeeder(),
    ];

    console.log('\nRunning seeders...\n');
    for (const seeder of seeders) {
      await seeder.run(AppDataSource);
    }

    console.log('\n✓ All seeds completed successfully');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error running seeds:', error);
    process.exit(1);
  }
}

runSeeds();
