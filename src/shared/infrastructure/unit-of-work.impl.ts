import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { IUnitOfWork } from '@shared/domain/unit-of-work.interface';

/**
 * Unit of Work Implementation using TypeORM
 * Manages database transactions
 */
@Injectable()
export class UnitOfWork implements IUnitOfWork {
  private queryRunner: QueryRunner | null = null;
  private repositoryInstances = new Map<string, any>();

  constructor(private readonly dataSource: DataSource) {}

  async startTransaction(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commit(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('Transaction not started');
    }
    await this.queryRunner.commitTransaction();
    await this.cleanup();
  }

  async rollback(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('Transaction not started');
    }
    await this.queryRunner.rollbackTransaction();
    await this.cleanup();
  }

  async withTransaction<T>(work: () => Promise<T>): Promise<T> {
    await this.startTransaction();
    try {
      const result = await work();
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  getRepository<T>(repositoryClass: new (...args: any[]) => T): T {
    const className = repositoryClass.name;
    
    if (!this.repositoryInstances.has(className)) {
      if (!this.queryRunner) {
        throw new Error('Transaction not started');
      }
      
      // Create repository instance with transaction query runner
      const instance = new repositoryClass(this.queryRunner.manager);
      this.repositoryInstances.set(className, instance);
    }
    
    return this.repositoryInstances.get(className);
  }

  private async cleanup(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.release();
      this.queryRunner = null;
      this.repositoryInstances.clear();
    }
  }
}