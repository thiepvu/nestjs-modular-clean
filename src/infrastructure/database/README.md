# Migration Commands Quick Reference

## Create schema
```bash
# 1. Create all schemas
npm run schema:create
```
## Generate Migrations

```bash
# Single module
npm run migration:generate -- --name=CreateUserTable --module=users
npm run migration:generate -- --name=AddEmailIndex --module=products
npm run migration:generate -- --name=UpdateOrderStatus --module=orders

# All modules
npm run migration:generate -- --name=InitialSchema --all
```

## Run Migrations

```bash
# Single module
npm run migration:run -- --module=users
npm run migration:run -- --module=products
npm run migration:run -- --module=orders

# All modules
npm run migration:run -- --all
```

## Revert Migrations

```bash
# Single module (reverts last migration)
npm run migration:revert -- --module=users
npm run migration:revert -- --module=products

# All modules (reverts last migration in each)
npm run migration:revert -- --all
```

## Check Status

```bash
# Single module
npm run migration:status -- --module=users

# All modules
npm run migration:status -- --all
```

# Run seeders
```bash
# Single module
npm run seed:run -- --module=users

# All modules
npm run seed:run -- --all
```

## Common Workflows

### Initial Setup

```bash
# 1. Create all schemas
npm run schema:create

# 2. Generate initial schema for all modules

npm run migration:generate -- --name=InitialSchema --all

# 3. Run all migrations
npm run migration:run -- --all

# 4. Verify
npm run migration:status -- --all

# 5. Run Seeds
npm run seed:run -- --all
```

### Add New Feature to Module
```bash
# 1. Update entity in src/modules/users/domain/entities/

# 2. Generate migration
npm run migration:generate -- --name=AddUserFeature --module=users

# 3. Review migration file in migrations/users/

# 4. Run migration
npm run migration:run -- --module=users
```

### Rollback Last Change
```bash
# 1. Revert migration
npm run migration:revert -- --module=users

# 2. Verify
npm run migration:status -- --module=users
```

## Migration File Locations

```
migrations/
├── users/
│   └── {timestamp}-{name}.ts
├── products/
│   └── {timestamp}-{name}.ts
└── orders/
    └── {timestamp}-{name}.ts
```

## Tips

- ✅ Always review generated migrations before running
- ✅ Use descriptive migration names
- ✅ Test migrations locally before deploying
- ✅ Keep migrations small and focused
- ✅ Check status before and after running migrations