import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@shared/application/base.use-case';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { PaginationQueryDto, PaginatedResponseDto } from '@shared/presentation/dto/common.dto';

/**
 * Get All Users Use Case
 * Retrieves all users with pagination
 */
@Injectable()
export class GetAllUsersUseCase extends BaseUseCase<PaginationQueryDto, PaginatedResponseDto<User>> {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  async execute(input: PaginationQueryDto): Promise<PaginatedResponseDto<User>> {
    const { page = 1, limit = 10 } = input;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userRepository.findAll(undefined, {
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      }),
      this.userRepository.count(),
    ]);

    return new PaginatedResponseDto(users, total, page, limit);
  }
}