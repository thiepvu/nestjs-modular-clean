#!/usr/bin/env ts-node
import * as fs from 'fs';
import * as path from 'path';
import { DatabaseConfig } from '../config/database.config';

/**
 * Setup seeder directories for all modules
 */
function main() {
  console.log('🏗️  Setting up seeder directories...\n');

  const modulesPath = DatabaseConfig.MODULES_PATH;

  if (!fs.existsSync(modulesPath)) {
    console.error(`❌ Modules directory not found: ${modulesPath}`);
    process.exit(1);
  }

  const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Found ${modules.length} module(s):`);
  modules.forEach(m => console.log(`  - ${m}`));
  console.log('');

  let created = 0;
  let existed = 0;

  for (const moduleName of modules) {
    const modulePath = DatabaseConfig.getModulePath(moduleName);
    const infrastructurePath = path.join(modulePath, 'infrastructure');
    const seedsPath = path.join(infrastructurePath, 'seeds');

    // Create infrastructure directory if doesn't exist
    if (!fs.existsSync(infrastructurePath)) {
      fs.mkdirSync(infrastructurePath, { recursive: true });
      console.log(`  ✓ Created: ${infrastructurePath}`);
    }

    // Create seeds directory
    if (!fs.existsSync(seedsPath)) {
      fs.mkdirSync(seedsPath, { recursive: true });
      console.log(`  ✓ Created: ${seedsPath}`);
      
      // Create .gitkeep to preserve directory in git
      fs.writeFileSync(path.join(seedsPath, '.gitkeep'), '');
      
      created++;
    } else {
      console.log(`  ⏭️  Already exists: ${seedsPath}`);
      existed++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  Created: ${created}`);
  console.log(`  Already existed: ${existed}`);
  console.log(`  Total: ${modules.length}`);

  console.log(`\n✅ Setup complete!`);
  console.log(`\nYou can now create seeders in:`);
  modules.forEach(m => {
    console.log(`  src/modules/${m}/infrastructure/seeds/`);
  });

  process.exit(0);
}

main();