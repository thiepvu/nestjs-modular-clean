import { BaseEntity } from '@shared/domain/base.entity';

/**
 * User Domain Entity - Pure Domain
 * No framework dependencies
 * Represents a user in the system
 */
export class User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isActive: boolean;

  constructor(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    isActive: boolean = true,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.isActive = isActive;
  }

  /**
   * Get full name
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Activate user
   */
  activate(): void {
    this.isActive = true;
    this.touch();
  }

  /**
   * Deactivate user
   */
  deactivate(): void {
    this.isActive = false;
    this.touch();
  }

  /**
   * Change password
   */
  changePassword(newPassword: string): void {
    this.password = newPassword;
    this.touch();
  }

  /**
   * Update profile
   */
  updateProfile(firstName: string, lastName: string): void {
    this.firstName = firstName;
    this.lastName = lastName;
    this.touch();
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}