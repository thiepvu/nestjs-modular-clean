#!/usr/bin/env ts-node
import { config } from 'dotenv';
import { ModuleSchemaScanner } from '../utils/module-schema-scanner';
import { MigrationGenerator } from '../utils/migration-generator';

// Load environment variables
config();

/**
 * CLI for generating migrations
 * Now uses ModuleSchemaScanner to scan EntitySchema files
 * 
 * Usage:
 *   npm run migration:generate -- --name=CreateUserTable --module=users
 *   npm run migration:generate -- --name=InitialSchema --all
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  const options = {
    name: '',
    module: '',
    all: false,
  };

  for (const arg of args) {
    if (arg.startsWith('--name=')) {
      options.name = arg.split('=')[1];
    } else if (arg.startsWith('--module=')) {
      options.module = arg.split('=')[1];
    } else if (arg === '--all') {
      options.all = true;
    }
  }

  // Validate arguments
  if (!options.name) {
    console.error('❌ Error: Migration name is required');
    console.log('\nUsage:');
    console.log('  Generate for specific module:');
    console.log('    npm run migration:generate -- --name=CreateUserTable --module=users');
    console.log('\n  Generate for all modules:');
    console.log('    npm run migration:generate -- --name=InitialSchema --all');
    process.exit(1);
  }

  if (!options.all && !options.module) {
    console.error('❌ Error: Either --module or --all flag is required');
    process.exit(1);
  }

  try {
    const scanner = new ModuleSchemaScanner();
    const generator = new MigrationGenerator();

    if (options.all) {
      // Generate migrations for all modules
      console.log('🔍 Scanning all modules for EntitySchemas...\n');
      const modules = await scanner.scanAllModules();
      
      if (modules.length === 0) {
        console.log('No modules with schemas found.');
        process.exit(0);
      }

      console.log(`Found ${modules.length} module(s):`);
      modules.forEach(m => console.log(`  - ${m.name} (${m.schemas.length} schema(s))`));
      console.log('');

      console.log('📝 Generating migrations...\n');
      const results = await generator.generateAllMigrations(modules, options.name);

      if (results.size === 0) {
        console.log('\n✓ No changes detected in any module');
      } else {
        console.log(`\n✓ Generated ${results.size} migration(s):`);
        results.forEach((filePath, moduleName) => {
          console.log(`  - ${moduleName}: ${filePath}`);
        });
      }
    } else {
      // Generate migration for specific module
      console.log(`🔍 Scanning module: ${options.module}...\n`);
      const moduleInfo = await scanner.scanModule(options.module);

      if (!moduleInfo) {
        console.error(`❌ Module not found or has no schemas: ${options.module}`);
        console.error(`    Expected schemas at: modules/${options.module}/infrastructure/persistence/*.schema.ts`);
        process.exit(1);
      }

      console.log(`Found ${moduleInfo.schemas.length} schema(s) in ${moduleInfo.name}`);
      console.log(`Database schema: ${moduleInfo.schema}\n`);

      console.log('📝 Generating migration...\n');
      const filePath = await generator.generateMigration(moduleInfo, options.name);

      if (!filePath) {
        console.log('\n✓ No changes detected');
      } else {
        console.log(`\n✓ Migration generated: ${filePath}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();