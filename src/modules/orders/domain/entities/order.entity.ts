import { BaseEntity } from '@shared/domain/base.entity';

/**
 * Order Status Enum
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

/**
 * Order Domain Entity - Pure Domain
 * No framework dependencies
 * 
 * Note: We store userId and productId as references, not actual relations
 * This maintains module independence in a modular monolith
 */
export class Order extends BaseEntity {
  userId: string;       // Reference to User in Users module
  productId: string;    // Reference to Product in Products module
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  minPrice?: number;

  constructor(
    userId: string,
    productId: string,
    quantity: number,
    totalPrice: number,
    status: OrderStatus = OrderStatus.PENDING,
    minPrice: number,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.userId = userId;
    this.productId = productId;
    this.quantity = quantity;
    this.totalPrice = totalPrice;
    this.status = status;
    this.minPrice = minPrice;
  }

  /**
   * Calculate total price
   */
  static calculateTotalPrice(unitPrice: number, quantity: number): number {
    if (unitPrice < 0 || quantity < 0) {
      throw new Error('Price and quantity must be positive');
    }
    return unitPrice * quantity;
  }

  /**
   * Confirm order
   */
  confirm(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error(`Cannot confirm order with status ${this.status}`);
    }
    this.status = OrderStatus.CONFIRMED;
    this.touch();
  }

  /**
   * Ship order
   */
  ship(): void {
    if (this.status !== OrderStatus.CONFIRMED) {
      throw new Error(`Cannot ship order with status ${this.status}`);
    }
    this.status = OrderStatus.SHIPPED;
    this.touch();
  }

  /**
   * Deliver order
   */
  deliver(): void {
    if (this.status !== OrderStatus.SHIPPED) {
      throw new Error(`Cannot deliver order with status ${this.status}`);
    }
    this.status = OrderStatus.DELIVERED;
    this.touch();
  }

  /**
   * Cancel order
   */
  cancel(): void {
    if (this.status === OrderStatus.DELIVERED) {
      throw new Error('Cannot cancel delivered order');
    }
    if (this.status === OrderStatus.CANCELLED) {
      throw new Error('Order is already cancelled');
    }
    this.status = OrderStatus.CANCELLED;
    this.touch();
  }

  /**
   * Check if order is active
   */
  isActive(): boolean {
    return this.status !== OrderStatus.CANCELLED && this.status !== OrderStatus.DELIVERED;
  }

  /**
   * Check if order can be modified
   */
  canBeModified(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  /**
   * Update quantity (only for pending orders)
   */
  updateQuantity(newQuantity: number, unitPrice: number): void {
    if (!this.canBeModified()) {
      throw new Error(`Cannot modify order with status ${this.status}`);
    }
    if (newQuantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    this.quantity = newQuantity;
    this.totalPrice = Order.calculateTotalPrice(unitPrice, newQuantity);
    this.touch();
  }

  /**
   * Get status display name
   */
  getStatusDisplay(): string {
    const statusMap = {
      [OrderStatus.PENDING]: 'Pending',
      [OrderStatus.CONFIRMED]: 'Confirmed',
      [OrderStatus.SHIPPED]: 'Shipped',
      [OrderStatus.DELIVERED]: 'Delivered',
      [OrderStatus.CANCELLED]: 'Cancelled',
    };
    return statusMap[this.status];
  }
}