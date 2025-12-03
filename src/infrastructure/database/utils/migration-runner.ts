import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { ModuleInfo } from './module-entity-scanner';
import { DatabaseConfig } from '../config/database.config';
import { DataSourceFactory } from './data-source-factory';

/**
 * Migration Runner for Modules
 * Runs migrations per module or all modules
 */
export class MigrationRunner {
  private readonly migrationsBasePath: string;

  constructor(migrationsBasePath?: string) {
    this.migrationsBasePath = migrationsBasePath || DatabaseConfig.MIGRATIONS_BASE_PATH;
  }

  /**
   * Run migrations for a specific module
   */
  async runModuleMigrations(
    moduleInfo: ModuleInfo,
    options: { revert?: boolean } = {},
  ): Promise<void> {
    const moduleMigrationsPath = DatabaseConfig.getModuleMigrationsPath(moduleInfo.name);

    if (!fs.existsSync(moduleMigrationsPath)) {
      console.log(`No migrations found for module: ${moduleInfo.name}`);
      return;
    }

    // Load migration files
    const migrationFiles = fs.readdirSync(moduleMigrationsPath)
      .filter(file => file.endsWith(DatabaseConfig.MIGRATION_FILE_EXTENSION) || file.endsWith('.js'))
      .map(file => path.join(moduleMigrationsPath, file));

    if (migrationFiles.length === 0) {
      console.log(`No migration files found for module: ${moduleInfo.name}`);
      return;
    }

    // Create DataSource with migrations using factory
    const dataSource = DataSourceFactory.createModuleDataSourceWithMigrations(
      moduleInfo,
      migrationFiles,
      { logging: true }
    );

    try {
      await dataSource.initialize();

      if (options.revert) {
        console.log(`\n🔄 Reverting last migration for module: ${moduleInfo.name}`);
        await dataSource.undoLastMigration();
        console.log(`✓ Migration reverted for module: ${moduleInfo.name}`);
      } else {
        console.log(`\n🚀 Running migrations for module: ${moduleInfo.name}`);
        const migrations = await dataSource.runMigrations();
        
        if (migrations.length === 0) {
          console.log(`✓ No pending migrations for module: ${moduleInfo.name}`);
        } else {
          console.log(`✓ Executed ${migrations.length} migration(s) for module: ${moduleInfo.name}`);
          migrations.forEach(migration => {
            console.log(`  - ${migration.name}`);
          });
        }
      }

      await dataSource.destroy();
    } catch (error) {
      await dataSource.destroy();
      throw error;
    }
  }

  /**
   * Run migrations for all modules
   */
  async runAllMigrations(
    modules: ModuleInfo[],
    options: { revert?: boolean } = {},
  ): Promise<void> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Running migrations for ${modules.length} module(s)`);
    console.log('='.repeat(60));

    for (const module of modules) {
      try {
        await this.runModuleMigrations(module, options);
      } catch (error) {
        console.error(`\n❌ Error running migrations for ${module.name}:`, error.message);
        throw error;
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ All migrations completed successfully');
    console.log('='.repeat(60));
  }

  /**
   * Show migration status for a module
   */
  async showModuleMigrationStatus(moduleInfo: ModuleInfo): Promise<void> {
    const moduleMigrationsPath = DatabaseConfig.getModuleMigrationsPath(moduleInfo.name);

    if (!fs.existsSync(moduleMigrationsPath)) {
      console.log(`No migrations found for module: ${moduleInfo.name}`);
      return;
    }

    const migrationFiles = fs.readdirSync(moduleMigrationsPath)
      .filter(file => file.endsWith(DatabaseConfig.MIGRATION_FILE_EXTENSION) || file.endsWith('.js'))
      .map(file => path.join(moduleMigrationsPath, file));

    const dataSource = DataSourceFactory.createModuleDataSourceWithMigrations(
      moduleInfo,
      migrationFiles,
      { logging: false }
    );

    try {
      await dataSource.initialize();

      const migrationTableName = DatabaseConfig.getMigrationTableName(moduleInfo.name);
      const executedMigrations = await dataSource.query(
        `SELECT * FROM ${moduleInfo.schema}.${migrationTableName} ORDER BY timestamp ASC`,
      ).catch(() => []);

      const allMigrations = migrationFiles.map(file => path.basename(file));
      const executedNames = executedMigrations.map((m: any) => m.name);

      console.log(`\n📊 Migration Status for ${moduleInfo.name}:`);
      console.log(`Schema: ${moduleInfo.schema}`);
      console.log(`Total migrations: ${allMigrations.length}`);
      console.log(`Executed: ${executedNames.length}`);
      console.log(`Pending: ${allMigrations.length - executedNames.length}`);

      if (allMigrations.length > 0) {
        console.log(`\nMigrations:`);
        allMigrations.forEach(migration => {
          const status = executedNames.includes(migration.replace('.ts', '').replace('.js', ''))
            ? '✓ Executed'
            : '⏳ Pending';
          console.log(`  ${status} - ${migration}`);
        });
      }

      await dataSource.destroy();
    } catch (error) {
      await dataSource.destroy();
      throw error;
    }
  }

  /**
   * Show migration status for all modules
   */
  async showAllMigrationStatus(modules: ModuleInfo[]): Promise<void> {
    console.log(`\n${'='.repeat(60)}`);
    console.log('Migration Status Report');
    console.log('='.repeat(60));

    for (const module of modules) {
      try {
        await this.showModuleMigrationStatus(module);
      } catch (error) {
        console.error(`Error checking status for ${module.name}:`, error.message);
      }
    }

    console.log(`\n${'='.repeat(60)}`);
  }
}