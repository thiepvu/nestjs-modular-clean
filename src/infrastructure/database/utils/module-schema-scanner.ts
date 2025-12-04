import * as fs from 'fs';
import * as path from 'path';
import { DatabaseConfig } from '../config/database.config';

/**
 * Module Schema Info
 */
export interface ModuleSchemaInfo {
  name: string;
  path: string;
  schemas: any[];
  schema: string; // Database schema name
}

/**
 * Module Schema Scanner
 * Scans for EntitySchema files in infrastructure/persistence
 * Used for migrations that need TypeORM schemas
 */
export class ModuleSchemaScanner {
  private readonly modulesPath: string;
  private readonly schemasFolderPath = 'infrastructure/persistence';
  private readonly schemaFileSuffix = '.schema.ts';
  private readonly schemaFileSuffixJs = '.schema.js';

  constructor(modulesPath?: string) {
    this.modulesPath = modulesPath || DatabaseConfig.MODULES_PATH;
  }

  /**
   * Scan all modules for schemas (synchronous)
   */
  scanAllModulesSync(): ModuleSchemaInfo[] {
    const modules: ModuleSchemaInfo[] = [];
    
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
   * Scan all modules for schemas
   */
  async scanAllModules(): Promise<ModuleSchemaInfo[]> {
    return Promise.resolve(this.scanAllModulesSync());
  }

  /**
   * Scan a specific module for schemas (synchronous)
   */
  scanModuleSync(moduleName: string): ModuleSchemaInfo | null {
    const modulePath = DatabaseConfig.getModulePath(moduleName);
    const schemasPath = path.join(modulePath, this.schemasFolderPath);

    console.log(`  Module path: ${modulePath}`);
    console.log(`  Schemas path: ${schemasPath}`);
    console.log(`  Path exists: ${fs.existsSync(schemasPath)}`);

    if (!fs.existsSync(schemasPath)) {
      console.warn(`  ⚠️  No infrastructure/persistence directory found for module: ${moduleName}`);
      console.warn(`  Expected path: ${schemasPath}`);
      return null;
    }

    const schemas = this.loadSchemasFromPathSync(schemasPath);
    
    if (schemas.length === 0) {
      console.warn(`  ⚠️  No schemas found in module: ${moduleName}`);
      return null;
    }

    const dbSchema = DatabaseConfig.getSchemaName(moduleName);

    console.log(`  ✓ Successfully loaded ${schemas.length} schema(s) for ${moduleName}`);
    console.log(`  Database schema: ${dbSchema}`);

    return {
      name: moduleName,
      path: modulePath,
      schemas,
      schema: dbSchema,
    };
  }

  /**
   * Scan a specific module for schemas
   */
  async scanModule(moduleName: string): Promise<ModuleSchemaInfo | null> {
    return Promise.resolve(this.scanModuleSync(moduleName));
  }

  /**
   * Load all schema classes from a directory (synchronous)
   */
  private loadSchemasFromPathSync(schemasPath: string): any[] {
    const schemas: any[] = [];
    const files = fs.readdirSync(schemasPath)
      .filter(file => 
        file.endsWith(this.schemaFileSuffix) || 
        file.endsWith(this.schemaFileSuffixJs)
      );

    console.log(`  Scanning ${files.length} schema file(s) in ${schemasPath}`);

    for (const file of files) {
      try {
        const filePath = path.join(schemasPath, file);
        
        // Clear require cache
        if (require.cache[require.resolve(filePath)]) {
          delete require.cache[require.resolve(filePath)];
        }
        
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const schemaModule = require(filePath);
        
        const exports = Object.values(schemaModule);
        
        console.log(`  Found ${exports.length} export(s) in ${file}`);
        
        // Add all schema exports
        for (const exp of exports) {
          if (typeof exp === 'function' || (exp && exp.constructor && exp.constructor.name === 'EntitySchema')) {
            schemas.push(exp);
            const name = typeof exp === 'function' ? exp.name : 'EntitySchema';
            console.log(`  ✓ Loaded: ${name}`);
          }
        }
      } catch (error) {
        console.error(`  ✗ Error loading ${file}:`, error.message);
        if (error.stack) {
          console.error(`    Stack: ${error.stack.split('\n')[1]}`);
        }
      }
    }

    return schemas;
  }

  /**
   * Get schemas for specific modules
   */
  async getSchemasForModules(moduleNames: string[]): Promise<ModuleSchemaInfo[]> {
    const modules: ModuleSchemaInfo[] = [];

    for (const moduleName of moduleNames) {
      const moduleInfo = await this.scanModule(moduleName);
      if (moduleInfo) {
        modules.push(moduleInfo);
      }
    }

    return modules;
  }

  /**
   * Get all schemas from all modules (flattened) - synchronous
   */
  getAllSchemasSync(): any[] {
    const modules = this.scanAllModulesSync();
    return modules.flatMap(module => module.schemas);
  }

  /**
   * Get all schemas from all modules (flattened)
   */
  async getAllSchemas(): Promise<any[]> {
    return Promise.resolve(this.getAllSchemasSync());
  }
}