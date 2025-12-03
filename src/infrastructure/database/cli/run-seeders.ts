#!/usr/bin/env ts-node
import { config } from 'dotenv';
import { ModuleSeederScanner } from '../utils/module-seeder-scanner';
import { SeederRunner } from '../utils/seeder-runner';

// Load environment variables
config();

/**
 * CLI for running seeders
 * Usage:
 *   npm run seed:run -- --module=users
 *   npm run seed:run -- --all
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
    console.log('  Run seeders for specific module:');
    console.log('    npm run seed:run -- --module=users');
    console.log('\n  Run seeders for all modules:');
    console.log('    npm run seed:run -- --all');
    process.exit(1);
  }

  try {
    const scanner = new ModuleSeederScanner();
    const runner = new SeederRunner();

    if (options.all) {
      // Run seeders for all modules
      console.log('🔍 Scanning all modules for seeders...\n');
      const modules = await scanner.scanAllModules();
      
      if (modules.length === 0) {
        console.log('No modules with seeders found.');
        process.exit(0);
      }

      await runner.runAllSeeders(modules);
    } else {
      // Run seeders for specific module
      console.log(`🔍 Scanning module: ${options.module}...\n`);
      const moduleInfo = await scanner.scanModule(options.module);

      if (!moduleInfo) {
        console.error(`❌ Module not found or has no seeders: ${options.module}`);
        process.exit(1);
      }

      await runner.runModuleSeeders(moduleInfo);
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();