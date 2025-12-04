import { BaseEntity } from '@shared/domain/base.entity';

/**
 * Product Domain Entity - Pure Domain
 * No framework dependencies
 * Represents a product in the system
 */
export class Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  isAvailable: boolean;

  constructor(
    name: string,
    description: string,
    price: number,
    stock: number,
    sku: string,
    isAvailable: boolean = true,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.sku = sku;
    this.isAvailable = isAvailable;
  }

  /**
   * Check if product is in stock
   */
  isInStock(): boolean {
    return this.stock > 0;
  }

  /**
   * Check if product can fulfill quantity
   */
  canFulfillQuantity(quantity: number): boolean {
    return this.stock >= quantity;
  }

  /**
   * Reduce stock
   */
  reduceStock(quantity: number): void {
    if (!this.canFulfillQuantity(quantity)) {
      throw new Error(`Insufficient stock. Available: ${this.stock}, Requested: ${quantity}`);
    }
    this.stock -= quantity;
    if (this.stock === 0) {
      this.isAvailable = false;
    }
    this.touch();
  }

  /**
   * Add stock
   */
  addStock(quantity: number): void {
    this.stock += quantity;
    if (this.stock > 0 && !this.isAvailable) {
      this.isAvailable = true;
    }
    this.touch();
  }

  /**
   * Update price
   */
  updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error('Price cannot be negative');
    }
    this.price = newPrice;
    this.touch();
  }

  /**
   * Mark as available
   */
  markAsAvailable(): void {
    this.isAvailable = true;
    this.touch();
  }

  /**
   * Mark as unavailable
   */
  markAsUnavailable(): void {
    this.isAvailable = false;
    this.touch();
  }

  /**
   * Update product details
   */
  updateDetails(name: string, description: string): void {
    this.name = name;
    this.description = description;
    this.touch();
  }

  /**
   * Validate SKU format
   */
  static isValidSKU(sku: string): boolean {
    // SKU should be alphanumeric with optional hyphens
    const skuRegex = /^[A-Z0-9\-]+$/;
    return skuRegex.test(sku);
  }
}