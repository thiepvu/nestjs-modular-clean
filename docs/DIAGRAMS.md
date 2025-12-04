# Architecture Diagrams

## Clean Architecture Layers

```mermaid
graph TB
    subgraph Presentation["Presentation Layer"]
        C[Controllers]
        DTO[DTOs]
        F[Filters]
    end
    
    subgraph Application["Application Layer"]
        UC[Use Cases]
        ADto[Application DTOs]
    end
    
    subgraph Domain["Domain Layer"]
        E[Entities]
        RI[Repository Interfaces]
        DS[Domain Services]
    end
    
    subgraph Infrastructure["Infrastructure Layer"]
        REPO[Repository Implementations]
        DB[(Database)]
        EXT[External Services]
    end
    
    C --> UC
    UC --> RI
    REPO --> RI
    REPO --> DB
    
    style Presentation fill:#e1f5ff
    style Application fill:#fff4e1
    style Domain fill:#e8f5e9
    style Infrastructure fill:#fce4ec
```

## Module Structure

```mermaid
graph LR
    subgraph Users["Users Module"]
        UD[Domain]
        UA[Application]
        UI[Infrastructure]
        UP[Presentation]
    end
    
    subgraph Products["Products Module"]
        PD[Domain]
        PA[Application]
        PI[Infrastructure]
        PP[Presentation]
    end
    
    subgraph Orders["Orders Module"]
        OD[Domain]
        OA[Application]
        OI[Infrastructure]
        OP[Presentation]
    end
    
    subgraph Shared["Shared"]
        SD[Base Entities]
        SA[Base Use Cases]
        SI[Base Repositories]
        SP[Common DTOs]
    end
    
    UD -.->|extends| SD
    UA -.->|extends| SA
    UI -.->|extends| SI
    UP -.->|uses| SP
    
    PD -.->|extends| SD
    PA -.->|extends| SA
    PI -.->|extends| SI
    PP -.->|uses| SP
    
    OD -.->|extends| SD
    OA -.->|extends| SA
    OI -.->|extends| SI
    OP -.->|uses| SP
    
    OA -->|validates| UI
    OA -->|validates| PI
```

## Database Schemas

```mermaid
erDiagram
    USERS_SCHEMA {
        uuid id PK
        string email UK
        string first_name
        string last_name
        string password
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    PRODUCTS_SCHEMA {
        uuid id PK
        string name
        text description
        decimal price
        int stock
        string sku UK
        boolean is_available
        timestamp created_at
        timestamp updated_at
    }
    
    ORDERS_SCHEMA {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        int quantity
        decimal total_price
        enum status
        timestamp created_at
        timestamp updated_at
    }
    
    ORDERS_SCHEMA }o--|| USERS_SCHEMA : "references"
    ORDERS_SCHEMA }o--|| PRODUCTS_SCHEMA : "references"
```

## Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant UseCase
    participant Repository
    participant Database
    
    Client->>Controller: POST /api/v1/users
    Controller->>Controller: Validate DTO
    Controller->>UseCase: execute(createUserDto)
    UseCase->>Repository: findByEmail(email)
    Repository->>Database: SELECT * FROM users WHERE email = ?
    Database-->>Repository: null
    Repository-->>UseCase: null
    UseCase->>Repository: create(userData)
    Repository->>Database: INSERT INTO users
    Database-->>Repository: user
    Repository-->>UseCase: user
    UseCase-->>Controller: user
    Controller-->>Client: ApiResponse(user)
```

## Transaction Flow (Unit of Work)

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant UseCase
    participant UnitOfWork
    participant OrderRepo
    participant ProductRepo
    participant Database
    
    Client->>Controller: POST /api/v1/orders
    Controller->>UseCase: execute(createOrderDto)
    UseCase->>UnitOfWork: withTransaction()
    UnitOfWork->>Database: BEGIN TRANSACTION
    
    UseCase->>ProductRepo: findById(productId)
    ProductRepo->>Database: SELECT
    Database-->>ProductRepo: product
    ProductRepo-->>UseCase: product
    
    UseCase->>ProductRepo: update(stock - quantity)
    ProductRepo->>Database: UPDATE products
    
    UseCase->>OrderRepo: create(orderData)
    OrderRepo->>Database: INSERT INTO orders
    
    alt Success
        UnitOfWork->>Database: COMMIT
        Database-->>UnitOfWork: Success
        UnitOfWork-->>UseCase: order
        UseCase-->>Controller: order
        Controller-->>Client: ApiResponse(order)
    else Error
        UnitOfWork->>Database: ROLLBACK
        Database-->>UnitOfWork: Rolled back
        UnitOfWork-->>UseCase: Error
        UseCase-->>Controller: Error
        Controller-->>Client: ErrorResponse
    end
```

## Module Communication

```mermaid
graph TD
    subgraph Client["Client Layer"]
        HTTP[HTTP Request]
    end
    
    subgraph Orders["Orders Module"]
        OC[Orders Controller]
        OUC[Create Order Use Case]
        OR[Order Repository]
    end
    
    subgraph Users["Users Module"]
        UR[User Repository]
    end
    
    subgraph Products["Products Module"]
        PR[Product Repository]
    end
    
    subgraph Infrastructure["Infrastructure"]
        UOW[Unit of Work]
        DB[(PostgreSQL)]
    end
    
    HTTP --> OC
    OC --> OUC
    OUC --> UR
    OUC --> PR
    OUC --> OR
    OUC --> UOW
    UOW --> DB
    UR --> DB
    PR --> DB
    OR --> DB
    
    style Orders fill:#e1f5ff
    style Users fill:#fff4e1
    style Products fill:#e8f5e9
    style Infrastructure fill:#fce4ec
```

## Deployment Options

```mermaid
graph TB
    subgraph Current["Current: Modular Monolith"]
        APP[Single Application]
        DB1[(Single Database<br/>Multiple Schemas)]
        APP --> DB1
    end
    
    subgraph Future["Future: Microservices"]
        US[Users Service]
        PS[Products Service]
        OS[Orders Service]
        DBU[(Users DB)]
        DBP[(Products DB)]
        DBO[(Orders DB)]
        AG[API Gateway]
        
        AG --> US
        AG --> PS
        AG --> OS
        US --> DBU
        PS --> DBP
        OS --> DBO
        OS -.->|REST/gRPC| US
        OS -.->|REST/gRPC| PS
    end
    
    Current -.->|Easy Migration| Future
    
    style Current fill:#e8f5e9
    style Future fill:#e1f5ff
```

## API Versioning

```mermaid
graph LR
    Client[Client]
    
    subgraph API["API Gateway"]
        V1[Version 1]
        V2[Version 2]
    end
    
    subgraph Controllers["Controllers"]
        C1V1[Users Controller V1]
        C1V2[Users Controller V2]
        C2V1[Products Controller V1]
    end
    
    Client -->|/api/v1/users| V1
    Client -->|/api/v2/users| V2
    V1 --> C1V1
    V2 --> C1V2
    V1 --> C2V1
    
    style API fill:#e1f5ff
    style Controllers fill:#fff4e1
```
