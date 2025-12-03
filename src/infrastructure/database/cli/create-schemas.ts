#!/usr/bin/env ts-node
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { ModuleEntityScanner } from '../utils/module-entity-scanner';
import { DatabaseConfig } from '../config/database.config';

// Load environment variables
config();

/**
 * Create all schemas for all modules
 * Run this before running migrations
 */
async function main() {
  console.log('🏗️  Creating schemas for all modules...\n');

  const scanner = new ModuleEntityScanner();
  const modules = await scanner.scanAllModules();

  if (modules.length === 0) {
    console.log('No modules found.');
    process.exit(0);
  }

  // Create a simple DataSource just to execute schema creation
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env[DatabaseConfig.ENV_KEYS.DB_HOST] || DatabaseConfig.DEFAULTS.DB_HOST,
    port: parseInt(
      process.env[DatabaseConfig.ENV_KEYS.DB_PORT] || String(DatabaseConfig.DEFAULTS.DB_PORT),
      10,
    ),
    username: process.env[DatabaseConfig.ENV_KEYS.DB_USERNAME] || DatabaseConfig.DEFAULTS.DB_USERNAME,
    password: (process.env[DatabaseConfig.ENV_KEYS.DB_PASSWORD] || DatabaseConfig.DEFAULTS.DB_PASSWORD) as string,
    database: process.env[DatabaseConfig.ENV_KEYS.DB_DATABASE] || DatabaseConfig.DEFAULTS.DB_DATABASE,
  });

  try {
    await dataSource.initialize();

    console.log('Found modules:');
    modules.forEach(m => console.log(`  - ${m.name} → ${m.schema}`));
    console.log('');

    for (const module of modules) {
      console.log(`Creating schema: ${module.schema}`);
      await dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${module.schema}"`);
      console.log(`✓ Schema created: ${module.schema}`);
    }

    await dataSource.destroy();

    console.log('\n✅ All schemas created successfully!');
    console.log('\nYou can now run migrations:');
    console.log('  npm run migration:run -- --all');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await dataSource.destroy();
    process.exit(1);
  }
}

main();