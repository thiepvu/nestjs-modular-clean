import { Injectable, ConflictException } from '@nestjs/common';
import { BaseUseCase } from '@shared/application/base.use-case';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../../presentation/dto/product.dto';

/**
 * Create Product Use Case
 */
@Injectable()
export class CreateProductUseCase extends BaseUseCase<CreateProductDto, Product> {
  constructor(private readonly productRepository: IProductRepository) {
    super();
  }

  async execute(input: CreateProductDto): Promise<Product> {
    // Check if SKU already exists
    const existingProduct = await this.productRepository.findBySku(input.sku);
    if (existingProduct) {
      throw new ConflictException('Product with this SKU already exists');
    }

    return this.productRepository.create({
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      sku: input.sku,
      isAvailable: true,
    });
  }
}
