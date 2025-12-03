import * as fs from 'fs';
import * as path from 'path';
import { EntitySchema } from 'typeorm';
import { DatabaseConfig } from '../config/database.config';

/**
 * Module Entity Scanner
 * Automatically discovers entities from modules
 */
export interface ModuleInfo {
  name: string;
  path: string;
  entities: any[];
  schema: string;
}

export class ModuleEntityScanner {
  private readonly modulesPath: string;

  constructor(modulesPath?: string) {
    this.modulesPath = modulesPath || DatabaseConfig.MODULES_PATH;
  }

  /**
   * Scan all modules and their entities (synchronous)
   */
  scanAllModulesSync(): ModuleInfo[] {
    const modules: ModuleInfo[] = [];
    
    if (!fs.existsSync(this.modulesPath)) {
      throw new Error(`Modules directory not found: ${this.modulesPath}`);
    }

    const moduleDirs = fs.readdirSync(this.modulesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const moduleName of moduleDirs) {
      const moduleInfo = this.scanModuleSync(moduleName);
      if (moduleInfo) {
        modules.push(moduleInfo);
      }
    }

    return modules;
  }

  /**
   * Scan all modules and their entities
   */
  async scanAllModules(): Promise<ModuleInfo[]> {
    return Promise.resolve(this.scanAllModulesSync());
  }

  /**
   * Scan a specific module for entities (synchronous)
   */
  scanModuleSync(moduleName: string): ModuleInfo | null {
    const modulePath = DatabaseConfig.getModulePath(moduleName);
    const entitiesPath = DatabaseConfig.getModuleEntitiesPath(moduleName);

    console.log(`  Module path: ${modulePath}`);
    console.log(`  Entities path: ${entitiesPath}`);
    console.log(`  Path exists: ${fs.existsSync(entitiesPath)}`);

    if (!fs.existsSync(entitiesPath)) {
      console.warn(`  ⚠️  No entities directory found for module: ${moduleName}`);
      console.warn(`  Expected path: ${entitiesPath}`);
      return null;
    }

    const entities = this.loadEntitiesFromPathSync(entitiesPath);
    
    if (entities.length === 0) {
      console.warn(`  ⚠️  No entities found in module: ${moduleName}`);
      return null;
    }

    // Get schema name from config
    const schema = DatabaseConfig.getSchemaName(moduleName);

    console.log(`  ✓ Successfully loaded ${entities.length} entity/entities for ${moduleName}`);
    console.log(`  Schema: ${schema}`);

    return {
      name: moduleName,
      path: modulePath,
      entities,
      schema,
    };
  }

  /**
   * Scan a specific module for entities
   */
  async scanModule(moduleName: string): Promise<ModuleInfo | null> {
    return Promise.resolve(this.scanModuleSync(moduleName));
  }

  /**
   * Load all entity classes from a directory (synchronous)
   */
  private loadEntitiesFromPathSync(entitiesPath: string): any[] {
    const entities: any[] = [];
    const files = fs.readdirSync(entitiesPath)
      .filter(file => 
        file.endsWith(DatabaseConfig.ENTITY_FILE_SUFFIX) || 
        file.endsWith(DatabaseConfig.ENTITY_FILE_SUFFIX_JS)
      );

    console.log(`  Scanning ${files.length} entity file(s) in ${entitiesPath}`);

    for (const file of files) {
      try {
        // Use full path with extension for require
        const filePath = path.join(entitiesPath, file);
        
        // Clear require cache to ensure fresh load
        if (require.cache[require.resolve(filePath)]) {
          delete require.cache[require.resolve(filePath)];
        }
        
        // Use require with full path
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const entityModule = require(filePath);
        
        // Get all exports from the module
        const exports = Object.values(entityModule);
        
        console.log(`  Found ${exports.length} export(s) in ${file}`);
        
        // Add all class exports (TypeORM will validate them)
        for (const exp of exports) {
          if (typeof exp === 'function' && exp.prototype && exp.name) {
            entities.push(exp);
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

    return entities;
  }

  /**
   * Load all entity classes from a directory
   */
  private async loadEntitiesFromPath(entitiesPath: string): Promise<any[]> {
    return Promise.resolve(this.loadEntitiesFromPathSync(entitiesPath));
  }

  /**
   * Check if a class is a TypeORM entity (simplified)
   */
  private isEntityClass(obj: any): boolean {
    // Simple check - just verify it's a class with a name
    // TypeORM will do the real validation
    return typeof obj === 'function' && 
           obj.prototype && 
           obj.name && 
           obj.name.length > 0;
  }

  /**
   * Get entities for specific modules
   */
  async getEntitiesForModules(moduleNames: string[]): Promise<ModuleInfo[]> {
    const modules: ModuleInfo[] = [];

    for (const moduleName of moduleNames) {
      const moduleInfo = await this.scanModule(moduleName);
      if (moduleInfo) {
        modules.push(moduleInfo);
      }
    }

    return modules;
  }

  /**
   * Get all entities from all modules (flattened) - synchronous
   */
  getAllEntitiesSync(): any[] {
    const modules = this.scanAllModulesSync();
    return modules.flatMap(module => module.entities);
  }

  /**
   * Get all entities from all modules (flattened)
   */
  async getAllEntities(): Promise<any[]> {
    return Promise.resolve(this.getAllEntitiesSync());
  }
}