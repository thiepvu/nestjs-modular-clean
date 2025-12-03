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
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../dto/product.dto';
import { ApiResponseDto, PaginationQueryDto } from '@shared/presentation/dto/common.dto';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';

/**
 * Products Controller V1
 */
@ApiTags('Products')
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(@Body() createProductDto: CreateProductDto): Promise<ApiResponseDto<ProductResponseDto>> {
    const product = await this.createProductUseCase.execute(createProductDto);
    return ApiResponseDto.success(product as any, 'Product created successfully');
  }

  // Additional endpoints would be implemented similarly
}
