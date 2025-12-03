import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { UsersController } from './presentation/controllers/users.controller';

const useCases = [
  CreateUserUseCase,
  GetUserByIdUseCase,
  GetAllUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
];

/**
 * Users Module
 * Encapsulates all user-related functionality
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: UserRepository) => new CreateUserUseCase(userRepository),
      inject: ['IUserRepository'],
    },
    {
      provide: GetUserByIdUseCase,
      useFactory: (userRepository: UserRepository) => new GetUserByIdUseCase(userRepository),
      inject: ['IUserRepository'],
    },
    {
      provide: GetAllUsersUseCase,
      useFactory: (userRepository: UserRepository) => new GetAllUsersUseCase(userRepository),
      inject: ['IUserRepository'],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (userRepository: UserRepository) => new UpdateUserUseCase(userRepository),
      inject: ['IUserRepository'],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (userRepository: UserRepository) => new DeleteUserUseCase(userRepository),
      inject: ['IUserRepository'],
    },
    UserRepository,
  ],
  exports: [UserRepository],
})
export class UsersModule {}
