import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepositoryImpl } from '@shared/infrastructure/base.repository.impl';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

/**
 * User Repository Implementation
 * Implements user-specific database operations
 */
@Injectable()
export class UserRepository extends BaseRepositoryImpl<User> implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.userRepository.find({ where: { isActive: true } });
  }
}
