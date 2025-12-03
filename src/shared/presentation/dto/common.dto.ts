import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

/**
 * Standard API Response wrapper
 */
export class ApiResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  data?: T;

  @ApiProperty()
  timestamp: string;

  constructor(success: boolean, data?: T, message?: string) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data?: T, message?: string): ApiResponseDto<T> {
    return new ApiResponseDto(true, data, message);
  }

  static error(message: string): ApiResponseDto<null> {
    return new ApiResponseDto(false, null, message);
  }
}

/**
 * Paginated Response
 */
export class PaginatedResponseDto<T> {
  @ApiProperty()
  items: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}

/**
 * Pagination Query DTO
 */
export class PaginationQueryDto {
  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}