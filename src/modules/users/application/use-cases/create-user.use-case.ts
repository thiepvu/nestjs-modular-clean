import { Injectable, ConflictException } from '@nestjs/common';
import { BaseUseCase } from '@shared/application/base.use-case';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../../presentation/dto/user.dto';

/**
 * Create User Use Case
 * Handles the business logic for creating a new user
 */
@Injectable()
export class CreateUserUseCase extends BaseUseCase<CreateUserDto, User> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  async execute(input: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // In production, hash the password before saving
    // const hashedPassword = await hash(input.password, 10);

    // Create and save user
    return this.userRepository.create({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      password: input.password, // Should be hashed
      isActive: true,
    });
  }
}
