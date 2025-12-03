import { IBaseRepository } from '@shared/domain/base.repository.interface';
import { User } from '../entities/user.entity';

/**
 * User Repository Interface
 * Defines user-specific repository operations
 */
export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findActiveUsers(): Promise<User[]>;
}
