import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto/user.dto';
import { ApiResponseDto, PaginationQueryDto, PaginatedResponseDto } from '@shared/presentation/dto/common.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';

/**
 * Users Controller V1
 * Handles HTTP requests for user operations
 */
@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.createUserUseCase.execute(createUserDto);
    return ApiResponseDto.success(this.mapToResponseDto(user), 'User created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<ApiResponseDto<PaginatedResponseDto<UserResponseDto>>> {
    const result = await this.getAllUsersUseCase.execute(paginationQuery);
    return ApiResponseDto.success({
      ...result,
      items: result.items.map(user => this.mapToResponseDto(user)),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.getUserByIdUseCase.execute(id);
    return ApiResponseDto.success(this.mapToResponseDto(user));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.updateUserUseCase.execute({ id, data: updateUserDto });
    return ApiResponseDto.success(this.mapToResponseDto(user), 'User updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }

  private mapToResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
