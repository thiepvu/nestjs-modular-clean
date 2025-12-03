import * as fs from 'fs';
import * as path from 'path';
import { DatabaseConfig } from '../config/database.config';

/**
 * Module Seeder Info
 */
export interface ModuleSeederInfo {
  name: string;
  path: string;
  seeders: any[];
  schema: string;
}

/**
 * Module Seeder Scanner
 * Automatically discovers seeders from modules
 */
export class ModuleSeederScanner {
  private readonly modulesPath: string;
  private readonly seedersFolderName = 'seeds';
  private readonly seederFileSuffix = '.seeder.ts';
  private readonly seederFileSuffixJs = '.seeder.js';

  constructor(modulesPath?: string) {
    this.modulesPath = modulesPath || DatabaseConfig.MODULES_PATH;
  }

  /**
   * Scan all modules for seeders
   */
  async scanAllModules(): Promise<ModuleSeederInfo[]> {
    const modules: ModuleSeederInfo[] = [];
    
    if (!fs.existsSync(this.modulesPath)) {
      throw new Error(`Modules directory not found: ${this.modulesPath}`);
    }

    const moduleDirs = fs.readdirSync(this.modulesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const moduleName of moduleDirs) {
      const moduleInfo = await this.scanModule(moduleName);
      if (moduleInfo) {
        modules.push(moduleInfo);
      }
    }

    return modules;
  }

  /**
   * Scan a specific module for seeders
   */
  async scanModule(moduleName: string): Promise<ModuleSeederInfo | null> {
    const modulePath = DatabaseConfig.getModulePath(moduleName);
    const seedersPath = path.join(modulePath, 'infrastructure', this.seedersFolderName);

    console.log(`  Seeders path: ${seedersPath}`);
    console.log(`  Path exists: ${fs.existsSync(seedersPath)}`);

    if (!fs.existsSync(seedersPath)) {
      console.warn(`  ⚠️  No seeders directory found for module: ${moduleName}`);
      console.warn(`  Expected path: ${seedersPath}`);
      return null;
    }

    const seeders = this.loadSeedersFromPath(seedersPath);
    
    if (seeders.length === 0) {
      console.warn(`  ⚠️  No seeders found in module: ${moduleName}`);
      return null;
    }

    const schema = DatabaseConfig.getSchemaName(moduleName);

    console.log(`  ✓ Successfully loaded ${seeders.length} seeder(s) for ${moduleName}`);
    console.log(`  Schema: ${schema}`);

    return {
      name: moduleName,
      path: modulePath,
      seeders,
      schema,
    };
  }

  /**
   * Load all seeder classes from a directory
   */
  private loadSeedersFromPath(seedersPath: string): any[] {
    const seeders: any[] = [];
    const files = fs.readdirSync(seedersPath)
      .filter(file => 
        file.endsWith(this.seederFileSuffix) || 
        file.endsWith(this.seederFileSuffixJs)
      )
      .sort(); // Sort to ensure consistent order

    console.log(`  Scanning ${files.length} seeder file(s) in ${seedersPath}`);

    for (const file of files) {
      try {
        const filePath = path.join(seedersPath, file);
        
        // Clear require cache
        if (require.cache[require.resolve(filePath)]) {
          delete require.cache[require.resolve(filePath)];
        }
        
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const seederModule = require(filePath);
        
        const exports = Object.values(seederModule);
        
        console.log(`  Found ${exports.length} export(s) in ${file}`);
        
        // Add all class exports
        for (const exp of exports) {
          if (typeof exp === 'function' && exp.prototype && exp.name) {
            seeders.push(exp);
            console.log(`  ✓ Loaded: ${exp.name}`);
          }
        }
      } catch (error) {
        console.error(`  ✗ Error loading ${file}:`, error.message);
        if (error.stack) {
          console.error(`    Stack: ${error.stack.split('\n')[1]}`);
        }
      }
    }

    return seeders;
  }

  /**
   * Get seeders for specific modules
   */
  async getSeedersForModules(moduleNames: string[]): Promise<ModuleSeederInfo[]> {
    const modules: ModuleSeederInfo[] = [];

    for (const moduleName of moduleNames) {
      const moduleInfo = await this.scanModule(moduleName);
      if (moduleInfo) {
        modules.push(moduleInfo);
      }
    }

    return modules;
  }
}