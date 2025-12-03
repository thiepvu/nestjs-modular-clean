# API Examples

Base URL: `http://localhost:3000/api/v1`

## Users API

### Create User
```bash
POST /users

curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "securePassword123"
  }'

Response (201):
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Get All Users (Paginated)
```bash
GET /users?page=1&limit=10

curl http://localhost:3000/api/v1/users?page=1&limit=10

Response (200):
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "email": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "fullName": "John Doe",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Get User by ID
```bash
GET /users/:id

curl http://localhost:3000/api/v1/users/123e4567-e89b-12d3-a456-426614174000

Response (200):
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Update User
```bash
PUT /users/:id

curl -X PUT http://localhost:3000/api/v1/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "isActive": false
  }'

Response (200):
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "fullName": "Jane Doe",
    "isActive": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:01.000Z"
  },
  "timestamp": "2024-01-01T00:00:01.000Z"
}
```

### Delete User
```bash
DELETE /users/:id

curl -X DELETE http://localhost:3000/api/v1/users/123e4567-e89b-12d3-a456-426614174000

Response (204): No Content
```

## Products API

### Create Product
```bash
POST /products

curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro",
    "description": "High-performance laptop for professionals",
    "price": 1999.99,
    "stock": 50,
    "sku": "MBP-2024-001"
  }'

Response (201):
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "456e4567-e89b-12d3-a456-426614174001",
    "name": "MacBook Pro",
    "description": "High-performance laptop for professionals",
    "price": 1999.99,
    "stock": 50,
    "sku": "MBP-2024-001",
    "isAvailable": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Responses

### Validation Error
```bash
POST /users with invalid data

curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123"
  }'

Response (400):
{
  "success": false,
  "message": "Validation failed: email must be a valid email, password must be at least 6 characters",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Not Found
```bash
GET /users/non-existent-id

Response (404):
{
  "success": false,
  "message": "User with id non-existent-id not found",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Conflict Error
```bash
POST /users with existing email

Response (409):
{
  "success": false,
  "message": "User with this email already exists",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Orders API (Cross-Module Example)

### Create Order
```bash
POST /orders

curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "productId": "456e4567-e89b-12d3-a456-426614174001",
    "quantity": 2
  }'

Response (201):
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "789e4567-e89b-12d3-a456-426614174002",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "productId": "456e4567-e89b-12d3-a456-426614174001",
    "quantity": 2,
    "totalPrice": 3999.98,
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}

Note: This operation:
1. Validates user exists (Users module)
2. Validates product exists and has stock (Products module)
3. Updates product stock (Products module)
4. Creates order (Orders module)
All in a single transaction!
```

## Testing with Postman

Import this collection:

```json
{
  "info": {
    "name": "Modular Monolith API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Users",
      "item": [
        {
          "name": "Create User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"firstName\": \"Test\",\n  \"lastName\": \"User\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/users",
              "host": ["{{baseUrl}}"],
              "path": ["users"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api/v1"
    }
  ]
}
```

## Health Check

```bash
GET /

curl http://localhost:3000

Response: Application information
```

## API Versioning

### V1 Endpoints (Current)
```
http://localhost:3000/api/v1/users
http://localhost:3000/api/v1/products
http://localhost:3000/api/v1/orders
```

### V2 Endpoints (Future)
```
http://localhost:3000/api/v2/users
```

To create V2:
```typescript
@Controller({ path: 'users', version: '2' })
export class UsersControllerV2 { }
```
