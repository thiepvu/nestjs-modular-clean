import { UserSchema } from '@modules/users/infrastructure/persistence/user.schema';
import { ProductSchema } from '@modules/products/infrastructure/persistence/product.schema';
import { OrderSchema } from '@modules/orders/infrastructure/persistence/order.schema';

/**
 * Entity Schemas Registry
 * Central place to register all TypeORM schemas
 * 
 * When adding a new module:
 * 1. Create pure domain entity (no TypeORM decorators)
 * 2. Create EntitySchema in infrastructure/persistence
 * 3. Import and add schema here
 * 
 * Benefits:
 * - Domain layer stays pure (no framework dependencies)
 * - Single source of truth for all entity schemas
 * - Easy to maintain and extend
 */
export const EntitySchemas = [
  UserSchema,
  ProductSchema,
  OrderSchema,
];