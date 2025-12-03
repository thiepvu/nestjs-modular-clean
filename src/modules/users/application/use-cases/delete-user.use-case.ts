import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseUseCase } from '@shared/application/base.use-case';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

/**
 * Delete User Use Case
 * Deletes a user by ID
 */
@Injectable()
export class DeleteUserUseCase extends BaseUseCase<string, boolean> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  async execute(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.userRepository.delete(id);
  }
}
