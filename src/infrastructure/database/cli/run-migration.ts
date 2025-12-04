#!/usr/bin/env ts-node
import { config } from 'dotenv';
import { ModuleSchemaScanner } from '../utils/module-schema-scanner';
import { MigrationRunner } from '../utils/migration-runner';

// Load environment variables
config();

/**
 * CLI for running migrations
 * Now uses ModuleSchemaScanner to scan EntitySchema files
 * 
 * Usage:
 *   npm run migration:run -- --module=users
 *   npm run migration:run -- --all
 *   npm run migration:revert -- --module=users
 *   npm run migration:revert -- --all
 */
async function main() {
  const args = process.argv.slice(2);
  const scriptName = process.argv[1];
  
  // Determine if this is revert operation
  const isRevert = scriptName.includes('revert');
  
  // Parse arguments
  const options = {
    module: '',
    all: false,
    revert: isRevert,
  };

  for (const arg of args) {
    if (arg.startsWith('--module=')) {
      options.module = arg.split('=')[1];
    } else if (arg === '--all') {
      options.all = true;
    }
  }

  // Validate arguments
  if (!options.all && !options.module) {
    console.error('❌ Error: Either --module or --all flag is required');
    console.log('\nUsage:');
    console.log('  Run migrations for specific module:');
    console.log('    npm run migration:run -- --module=users');
    console.log('\n  Run migrations for all modules:');
    console.log('    npm run migration:run -- --all');
    console.log('\n  Revert last migration for specific module:');
    console.log('    npm run migration:revert -- --module=users');
    console.log('\n  Revert last migration for all modules:');
    console.log('    npm run migration:revert -- --all');
    process.exit(1);
  }

  try {
    const scanner = new ModuleSchemaScanner();
    const runner = new MigrationRunner();

    if (options.all) {
      // Run migrations for all modules
      console.log('🔍 Scanning all modules for EntitySchemas...\n');
      const modules = await scanner.scanAllModules();
      
      if (modules.length === 0) {
        console.log('No modules with schemas found.');
        process.exit(0);
      }

      await runner.runAllMigrations(modules, { revert: options.revert });
    } else {
      // Run migration for specific module
      console.log(`🔍 Loading module: ${options.module}...\n`);
      const moduleInfo = await scanner.scanModule(options.module);

      if (!moduleInfo) {
        console.error(`❌ Module not found or has no schemas: ${options.module}`);
        console.error(`    Expected schemas at: modules/${options.module}/infrastructure/persistence/*.schema.ts`);
        process.exit(1);
      }

      await runner.runModuleMigrations(moduleInfo, { revert: options.revert });
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();