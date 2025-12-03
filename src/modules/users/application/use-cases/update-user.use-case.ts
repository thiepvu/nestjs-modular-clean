import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseUseCase } from '@shared/application/base.use-case';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UpdateUserDto } from '../../presentation/dto/user.dto';

interface UpdateUserInput {
  id: string;
  data: UpdateUserDto;
}

/**
 * Update User Use Case
 * Updates user information
 */
@Injectable()
export class UpdateUserUseCase extends BaseUseCase<UpdateUserInput, User> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  async execute(input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findById(input.id);
    if (!user) {
      throw new NotFoundException(`User with id ${input.id} not found`);
    }

    return this.userRepository.update(input.id, input.data);
  }
}
