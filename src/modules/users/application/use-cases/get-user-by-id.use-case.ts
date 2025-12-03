import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseUseCase } from '@shared/application/base.use-case';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

/**
 * Get User By ID Use Case
 * Retrieves a user by their ID
 */
@Injectable()
export class GetUserByIdUseCase extends BaseUseCase<string, User> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
