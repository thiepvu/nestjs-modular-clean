#!/usr/bin/env ts-node
import { config } from 'dotenv';
import { ModuleEntityScanner } from '../utils/module-entity-scanner';
import { MigrationRunner } from '../utils/migration-runner';

// Load environment variables
config();

/**
 * CLI for checking migration status
 * Usage:
 *   npm run migration:status -- --module=users
 *   npm run migration:status -- --all
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  const options = {
    module: '',
    all: false,
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
    console.log('  Check status for specific module:');
    console.log('    npm run migration:status -- --module=users');
    console.log('\n  Check status for all modules:');
    console.log('    npm run migration:status -- --all');
    process.exit(1);
  }

  try {
    const scanner = new ModuleEntityScanner();
    const runner = new MigrationRunner();

    if (options.all) {
      // Show status for all modules
      const modules = await scanner.scanAllModules();
      
      if (modules.length === 0) {
        console.log('No modules with entities found.');
        process.exit(0);
      }

      await runner.showAllMigrationStatus(modules);
    } else {
      // Show status for specific module
      const moduleInfo = await scanner.scanModule(options.module);

      if (!moduleInfo) {
        console.error(`❌ Module not found: ${options.module}`);
        process.exit(1);
      }

      await runner.showModuleMigrationStatus(moduleInfo);
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();