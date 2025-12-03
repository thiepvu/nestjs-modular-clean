# Quick Start Guide

## Prerequisites
- Node.js v18+
- PostgreSQL 14+
- Docker (optional)

## Option 1: Using Docker (Recommended)

### 1. Start Database
```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- pgAdmin on port 5050 (http://localhost:5050)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
```

### 4. Run Migrations
```bash
npm run migration:run
```

### 5. Seed Database
```bash
npm run seed:run
```

### 6. Start Application
```bash
npm run start:dev
```

Visit: http://localhost:3000/api/docs

## Option 2: Manual Setup

### 1. Create Database
```bash
psql -U postgres
CREATE DATABASE modular_monolith;
\q
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Run Migrations
```bash
npm run migration:run
```

### 5. Seed Database
```bash
npm run seed:run
```

### 6. Start Application
```bash
npm run start:dev
```

## Testing the API

### Create a User
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123"
  }'
```

### Get All Users
```bash
curl http://localhost:3000/api/v1/users?page=1&limit=10
```

### Create a Product
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "A test product",
    "price": 99.99,
    "stock": 100,
    "sku": "TEST-001"
  }'
```

## Verify Setup

1. **Check API Documentation**: http://localhost:3000/api/docs
2. **Check Database**:
   ```bash
   psql -U postgres -d modular_monolith
   \dn  # List schemas
   \dt users_schema.*  # List tables in users schema
   ```

## Common Issues

### Port Already in Use
```bash
# Change PORT in .env
PORT=3001
```

### Database Connection Error
1. Verify PostgreSQL is running
2. Check credentials in .env
3. Ensure database exists

### Migration Errors
```bash
# Revert and retry
npm run migration:revert
npm run migration:run
```

## Development Workflow

### Watch Mode
```bash
npm run start:dev
```

### Run Tests
```bash
npm run test
```

### Generate Migration
```bash
npm run typeorm -- migration:generate src/infrastructure/database/migrations/YourMigrationName -d src/infrastructure/database/data-source.ts
```

### Format Code
```bash
npm run format
```

### Lint Code
```bash
npm run lint
```

## Next Steps

1. Explore the API documentation at `/api/docs`
2. Review the architecture in `ARCHITECTURE.md`
3. Check example requests in `API_EXAMPLES.md`
4. Start building your own modules!

## Useful Commands

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger

# Build
npm run build              # Build for production
npm run start:prod         # Run production build

# Database
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration
npm run seed:run          # Seed database

# Testing
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage report
```

## Support

For issues or questions:
1. Check existing documentation
2. Review architecture guide
3. Open an issue on GitHub
