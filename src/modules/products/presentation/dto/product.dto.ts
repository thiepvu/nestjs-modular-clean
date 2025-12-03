import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';

/**
 * Create Product DTO
 */
export class CreateProductDto {
  @ApiProperty({ example: 'MacBook Pro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'High-performance laptop' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1999.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'MBP-2024-001' })
  @IsString()
  @IsNotEmpty()
  sku: string;
}

/**
 * Update Product DTO
 */
export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

/**
 * Product Response DTO
 */
export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  isAvailable: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
