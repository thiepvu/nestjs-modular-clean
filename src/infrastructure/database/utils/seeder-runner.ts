import { DataSource } from 'typeorm';
import { ModuleSeederInfo } from './module-seeder-scanner';
import { DataSourceFactory } from './data-source-factory';
import { ISeeder } from '../seeders/base.seeder';
import { EntitySchemas } from '../entity-schemas.registry';

/**
 * Seeder Runner
 * Runs seeders for modules
 * 
 * Uses EntitySchemas registry for clean architecture
 */
export class SeederRunner {
  /**
   * Run seeders for a specific module
   */
  async runModuleSeeders(moduleSeederInfo: ModuleSeederInfo): Promise<void> {
    if (moduleSeederInfo.seeders.length === 0) {
      console.log(`No seeders found for module: ${moduleSeederInfo.name}`);
      return;
    }

    // Use EntitySchemas registry
    console.log(`  Loaded ${EntitySchemas.length} entity schemas for DataSource`);

    // Create DataSource with all entity schemas
    const dataSource = DataSourceFactory.createApplicationDataSource(EntitySchemas, {
      logging: false,
    });

    try {
      await dataSource.initialize();

      console.log(`\n🌱 Running seeders for module: ${moduleSeederInfo.name}`);
      console.log(`Schema: ${moduleSeederInfo.schema}`);
      console.log(`Seeders: ${moduleSeederInfo.seeders.length}`);

      for (const SeederClass of moduleSeederInfo.seeders) {
        try {
          console.log(`\n  📦 Running: ${SeederClass.name}`);
          
          const seeder: ISeeder = new SeederClass();
          await seeder.run(dataSource);
          
          console.log(`  ✓ Completed: ${SeederClass.name}`);
        } catch (error) {
          console.error(`  ✗ Error in ${SeederClass.name}:`, error.message);
          throw error;
        }
      }

      console.log(`\n✓ Completed all seeders for module: ${moduleSeederInfo.name}`);
      
      await dataSource.destroy();
    } catch (error) {
      await dataSource.destroy();
      throw error;
    }
  }

  /**
   * Run seeders for all modules
   */
  async runAllSeeders(modules: ModuleSeederInfo[]): Promise<void> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Running seeders for ${modules.length} module(s)`);
    console.log('='.repeat(60));

    for (const module of modules) {
      try {
        await this.runModuleSeeders(module);
      } catch (error) {
        console.error(`\n❌ Error running seeders for ${module.name}:`, error.message);
        throw error;
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ All seeders completed successfully');
    console.log('='.repeat(60));
  }
}