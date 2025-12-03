# Architecture Documentation

## Overview

This project implements a **Modular Monolith** architecture with **Clean Architecture** principles. It combines the simplicity of a monolith with the modularity of microservices.

## Core Principles

### 1. Clean Architecture Layers

Each module follows a four-layer architecture:

#### Domain Layer (Core Business Logic)
- **Purpose**: Contains business entities and business rules
- **Dependencies**: None (most independent layer)
- **Location**: `modules/{module}/domain/`
- **Contains**:
  - Entities: Core business objects
  - Repository Interfaces: Contracts for data access
  - Domain Services: Business logic that doesn't fit in entities

**Example**:
```typescript
// User Entity - Pure business object
@Entity()
export class User extends BaseEntity {
  @Column()
  email: string;
  
  @Column()
  firstName: string;
  
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

// Repository Interface - Contract
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
}
```

#### Application Layer (Use Cases)
- **Purpose**: Orchestrates business logic
- **Dependencies**: Domain layer only
- **Location**: `modules/{module}/application/`
- **Contains**:
  - Use Cases: Application-specific business rules
  - DTOs: Data structures for use case input/output

**Example**:
```typescript
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  
  async execute(input: CreateUserDto): Promise<User> {
    // Business logic here
    const exists = await this.userRepository.findByEmail(input.email);
    if (exists) throw new ConflictException();
    
    return this.userRepository.create(input);
  }
}
```

#### Infrastructure Layer (Technical Details)
- **Purpose**: Implements technical capabilities
- **Dependencies**: Domain layer (implements interfaces)
- **Location**: `modules/{module}/infrastructure/`
- **Contains**:
  - Repository Implementations: Data access code
  - External Service Adapters: Third-party integrations

**Example**:
```typescript
export class UserRepository implements IUserRepository {
  constructor(private typeormRepo: Repository<User>) {}
  
  async findByEmail(email: string): Promise<User | null> {
    return this.typeormRepo.findOne({ where: { email } });
  }
}
```

#### Presentation Layer (API Interface)
- **Purpose**: Handles HTTP requests/responses
- **Dependencies**: Application layer
- **Location**: `modules/{module}/presentation/`
- **Contains**:
  - Controllers: HTTP endpoint handlers
  - DTOs: Request/response data structures
  - Filters: Exception handling

**Example**:
```typescript
@Controller('users')
export class UsersController {
  constructor(private createUserUseCase: CreateUserUseCase) {}
  
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(dto);
    return ApiResponseDto.success(user);
  }
}
```

### 2. Module Independence

Each module is a self-contained unit:

```
users/
├── domain/           # Business rules (no external dependencies)
├── application/      # Use cases (depends on domain)
├── infrastructure/   # Implementation details (depends on domain)
└── presentation/     # API layer (depends on application)
```

**Benefits**:
- Easy to understand and maintain
- Can be extracted to microservice if needed
- Clear boundaries and responsibilities

### 3. Schema-per-Module

Each module has its own PostgreSQL schema:

```sql
-- Users Module
CREATE SCHEMA users_schema;
CREATE TABLE users_schema.users (...);

-- Products Module
CREATE SCHEMA products_schema;
CREATE TABLE products_schema.products (...);

-- Orders Module
CREATE SCHEMA orders_schema;
CREATE TABLE orders_schema.orders (...);
```

**Benefits**:
- Logical separation of data
- Clear module boundaries
- Easy to backup/restore specific modules
- Migration path to separate databases

## Design Patterns

### Repository Pattern

**Purpose**: Abstracts data access logic from business logic

**Implementation**:
```typescript
// 1. Define interface in domain layer
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  create(data: DeepPartial<User>): Promise<User>;
}

// 2. Implement in infrastructure layer
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }
}

// 3. Inject interface in use case
export class GetUserUseCase {
  constructor(private userRepo: IUserRepository) {}
}
```

**Benefits**:
- Business logic doesn't depend on database
- Easy to test with mocks
- Can swap implementations without changing business logic

### Unit of Work Pattern

**Purpose**: Manages transactions across multiple repositories

**Implementation**:
```typescript
export class CreateOrderUseCase {
  constructor(
    private orderRepo: IOrderRepository,
    private productRepo: IProductRepository,
    private unitOfWork: UnitOfWork,
  ) {}

  async execute(input: CreateOrderDto): Promise<Order> {
    return this.unitOfWork.withTransaction(async () => {
      // Update product stock
      await this.productRepo.update(input.productId, {
        stock: product.stock - input.quantity
      });
      
      // Create order
      return this.orderRepo.create(orderData);
      
      // If any operation fails, all changes are rolled back
    });
  }
}
```

**Benefits**:
- Ensures data consistency
- Automatic rollback on failure
- Clean transaction management

### Use Case Pattern

**Purpose**: Encapsulates single business operation

**Structure**:
```typescript
export abstract class BaseUseCase<TInput, TOutput> {
  abstract execute(input: TInput): Promise<TOutput>;
}

export class CreateUserUseCase extends BaseUseCase<CreateUserDto, User> {
  async execute(input: CreateUserDto): Promise<User> {
    // Single responsibility: create user
  }
}
```

**Benefits**:
- Single Responsibility Principle
- Easy to test
- Clear business operations

## Cross-Module Communication

### Problem
Modules should be independent but sometimes need to communicate.

### Solution: Dependency Injection

```typescript
@Module({
  imports: [
    UsersModule,      // Import other modules
    ProductsModule,
  ],
  providers: [
    CreateOrderUseCase,  // Use case needs both modules
  ],
})
export class OrdersModule {}
```

**In Use Case**:
```typescript
export class CreateOrderUseCase {
  constructor(
    private orderRepo: IOrderRepository,
    private userRepo: UserRepository,      // From Users module
    private productRepo: ProductRepository, // From Products module
  ) {}

  async execute(input: CreateOrderDto): Promise<Order> {
    // Validate user exists
    const user = await this.userRepo.findById(input.userId);
    
    // Validate product exists
    const product = await this.productRepo.findById(input.productId);
    
    // Create order
    return this.orderRepo.create(...);
  }
}
```

**Best Practices**:
- Keep cross-module calls minimal
- Use events for loose coupling (future enhancement)
- Document module dependencies

## API Versioning

**Configuration**:
```typescript
// main.ts
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1',
});
```

**Usage**:
```typescript
@Controller({ path: 'users', version: '1' })
export class UsersControllerV1 { }

@Controller({ path: 'users', version: '2' })
export class UsersControllerV2 { }
```

**URLs**:
- Version 1: `GET /api/v1/users`
- Version 2: `GET /api/v2/users`

## Error Handling

### Global Exception Filter

All exceptions are caught and transformed to consistent format:

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Transform to ApiResponseDto
    return ApiResponseDto.error(message);
  }
}
```

**Response Format**:
```json
{
  "success": false,
  "message": "User with this email already exists",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Testing Strategy

### Unit Tests
```typescript
describe('CreateUserUseCase', () => {
  it('should create user', async () => {
    // Arrange
    const mockRepo = { 
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(user)
    };
    const useCase = new CreateUserUseCase(mockRepo);
    
    // Act
    const result = await useCase.execute(dto);
    
    // Assert
    expect(result).toBeDefined();
  });
});
```

### Integration Tests
```typescript
describe('UsersController (e2e)', () => {
  it('POST /users', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send(createUserDto)
      .expect(201);
  });
});
```

## Migration Strategy

### From Monolith to Microservices

If a module needs to be extracted:

1. **Module already has clear boundaries**
2. **Has own database schema**
3. **Dependencies are explicit**

**Steps**:
1. Create new microservice project
2. Copy module code
3. Update cross-module calls to HTTP/gRPC
4. Migrate schema to separate database
5. Update main app to call microservice

## Performance Considerations

### Database Indexes

Each entity has appropriate indexes:

```typescript
// In migrations
await queryRunner.query(`
  CREATE INDEX idx_users_email ON users_schema.users(email);
  CREATE INDEX idx_users_is_active ON users_schema.users(is_active);
`);
```

### Connection Pooling

TypeORM manages connection pool automatically:

```typescript
// database.module.ts
{
  type: 'postgres',
  // ... other config
  // Connection pool managed by TypeORM
}
```

### Query Optimization

Use appropriate loading strategies:

```typescript
// Eager loading
this.repository.find({ relations: ['orders'] });

// Lazy loading
this.repository.findOne({ where: { id } });
```

## Security Best Practices

1. **Password Hashing**
```typescript
// In production, use bcrypt
const hashedPassword = await hash(password, 10);
```

2. **Input Validation**
```typescript
// DTOs with class-validator
export class CreateUserDto {
  @IsEmail()
  email: string;
  
  @MinLength(6)
  password: string;
}
```

3. **SQL Injection Prevention**
- TypeORM uses parameterized queries automatically
- Never concatenate SQL strings

## Monitoring and Logging

Add structured logging:

```typescript
export class CreateUserUseCase {
  private logger = new Logger(CreateUserUseCase.name);
  
  async execute(input: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user: ${input.email}`);
    // ... logic
    this.logger.log(`User created: ${user.id}`);
  }
}
```

## Future Enhancements

1. **Event-Driven Architecture**
   - Add domain events
   - Implement event bus
   - Decouple modules further

2. **CQRS (If needed)**
   - Separate read/write models
   - Optimize queries
   - Add read replicas

3. **API Gateway**
   - Rate limiting
   - Authentication
   - Request logging

4. **Caching**
   - Redis integration
   - Cache frequently accessed data
   - Invalidation strategy
