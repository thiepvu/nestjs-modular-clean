# NestJS Modular Monolith with Clean Architecture

A production-ready Modular Monolith implementation using NestJS, TypeORM, and PostgreSQL, following Clean Architecture principles and best practices.

## 🏗️ Architecture Overview

This project implements a **Modular Monolith** architecture where:

- Each module is self-contained with its own domain, application, infrastructure, and presentation layers
- Each module has its own database schema
- Modules communicate through well-defined interfaces
- Cross-cutting concerns are handled at the shared level

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│              (Controllers, DTOs, Filters)               │
├─────────────────────────────────────────────────────────┤
│                   Application Layer                      │
│                   (Use Cases, DTOs)                      │
├─────────────────────────────────────────────────────────┤
│                     Domain Layer                         │
│         (Entities, Repository Interfaces)                │
├─────────────────────────────────────────────────────────┤
│                 Infrastructure Layer                     │
│        (Repository Implementations, Database)            │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
src/
├── modules/                          # Feature modules
│   ├── users/                       # Users module
│   │   ├── domain/                  # Domain layer
│   │   │   ├── entities/           # Domain entities
│   │   │   └── repositories/       # Repository interfaces
│   │   ├── application/            # Application layer
│   │   │   └── use-cases/         # Business logic
│   │   ├── infrastructure/         # Infrastructure layer
│   │   │   └── persistence/       # Repository implementations
│   │   ├── presentation/           # Presentation layer
│   │   │   ├── controllers/       # REST controllers
│   │   │   └── dto/               # Data transfer objects
│   │   └── users.module.ts        # Module definition
│   ├── products/                   # Products module
│   └── orders/                     # Orders module
│
├── shared/                         # Shared/common code
│   ├── domain/                     # Shared domain concepts
│   │   ├── base.entity.ts
│   │   ├── base.repository.interface.ts
│   │   └── unit-of-work.interface.ts
│   ├── application/                # Shared application layer
│   │   └── base.use-case.ts
│   ├── infrastructure/             # Shared infrastructure
│   │   ├── base.repository.impl.ts
│   │   └── unit-of-work.impl.ts
│   └── presentation/               # Shared presentation
│       ├── dto/
│       └── filters/
│
├── infrastructure/                 # Cross-cutting infrastructure
│   └── database/
│       ├── migrations/             # Database migrations
│       ├── seeds/                  # Database seeders
│       ├── database.module.ts
│       └── data-source.ts
│
├── app.module.ts                   # Root module
└── main.ts                         # Application entry point
```

## 🎯 Key Features

### 1. Clean Architecture
- **Separation of Concerns**: Each layer has a specific responsibility
- **Dependency Rule**: Dependencies point inward (from infrastructure to domain)
- **Framework Independence**: Business logic is independent of frameworks

### 2. Modular Monolith
- **Module Independence**: Each module is self-contained
- **Schema Isolation**: Each module has its own database schema
- **Clear Boundaries**: Modules communicate through well-defined interfaces

### 3. Design Patterns

#### Repository Pattern
- Abstracts data access logic
- Each module has its own repository interface and implementation
- Example: `IUserRepository` interface, `UserRepository` implementation

#### Unit of Work Pattern
- Manages transactions across multiple repositories
- Ensures data consistency
- Example: Creating an order that updates product stock in a single transaction

```typescript
await unitOfWork.withTransaction(async () => {
  await productRepository.update(productId, { stock: newStock });
  await orderRepository.create(orderData);
});
```

### 4. API Versioning
- URI-based versioning (e.g., `/api/v1/users`)
- Easy to maintain multiple API versions
- Configured in `main.ts`

### 5. Cross-Cutting Concerns
- **Global Exception Filter**: Standardized error responses
- **Validation Pipe**: Automatic DTO validation
- **Swagger Documentation**: Auto-generated API docs

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd nestjs-modular-monolith
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=modular_monolith
DB_USERS_SCHEMA=users_schema
DB_ORDERS_SCHEMA=orders_schema
DB_PRODUCTS_SCHEMA=products_schema
```

4. **Create database**
```bash
psql -U postgres -c "CREATE DATABASE modular_monolith;"
```

5. **Run migrations**
```bash
npm run migration:run
```

6. **Seed database**
```bash
npm run seed:run
```

7. **Start the application**
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📚 API Documentation

Once the application is running, visit:
```
http://localhost:3000/api/docs
```

### Example Endpoints

#### Users Module
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users` - Get all users (paginated)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

#### Products Module
- `POST /api/v1/products` - Create a new product
- `GET /api/v1/products` - Get all products (paginated)
- `GET /api/v1/products/:id` - Get product by ID
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

#### Orders Module
- `POST /api/v1/orders` - Create a new order
- `GET /api/v1/orders` - Get all orders (paginated)
- `GET /api/v1/orders/:id` - Get order by ID

## 🗄️ Database Schema

Each module has its own PostgreSQL schema:

### Users Schema (`users_schema`)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Products Schema (`products_schema`)
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Orders Schema (`orders_schema`)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'PENDING',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🔄 Migrations

### Generate a new migration
```bash
npm run typeorm -- migration:generate -n MigrationName -d src/infrastructure/database/data-source.ts
```

### Run migrations
```bash
npm run migration:run
```

### Revert last migration
```bash
npm run migration:revert
```

## 🌱 Seeding

Seeds are located in `src/infrastructure/database/seeds/`

To run all seeds:
```bash
npm run seed:run
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Adding a New Module

1. **Create module structure**
```
src/modules/new-module/
├── domain/
│   ├── entities/
│   └── repositories/
├── application/
│   └── use-cases/
├── infrastructure/
│   └── persistence/
├── presentation/
│   ├── controllers/
│   └── dto/
└── new-module.module.ts
```

2. **Create migration**
```typescript
// Create schema and tables
export class CreateNewModuleSchema implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS new_module_schema`);
    // Add table creation logic
  }
}
```

3. **Create seeder**
```typescript
export class NewModuleSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    // Add seed data
  }
}
```

4. **Register in AppModule**
```typescript
@Module({
  imports: [
    // ...
    NewModule,
  ],
})
export class AppModule {}
```

## 🔐 Best Practices

### 1. **Dependency Injection**
- Use constructor injection
- Inject interfaces, not implementations
- Use factories for complex instantiation

### 2. **Error Handling**
- Use domain-specific exceptions
- Global exception filter handles all errors
- Return consistent error responses

### 3. **Validation**
- Use DTOs with class-validator
- Validate at the presentation layer
- Business rules in use cases

### 4. **Transactions**
- Use Unit of Work for cross-repository operations
- Keep transactions short
- Handle rollbacks properly

### 5. **Testing**
- Unit test use cases
- Mock repository interfaces
- Integration test with real database

## 🛠️ Technologies

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript
- **PostgreSQL** - Relational database
- **Swagger** - API documentation
- **class-validator** - DTO validation
- **class-transformer** - Object transformation

## 📝 License

MIT

## 👥 Contributing

Contributions are welcome! Please read the contributing guidelines first.

## 📧 Support

For support, email support@example.com or open an issue.
