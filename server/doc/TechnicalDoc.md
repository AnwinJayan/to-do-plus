# Technical Documentation: Express Template Mid (TypeScript)

## 1. Complete File and Folder Tree

```
express-template-mid-ts/
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── docs/
│   ├── API.md
│   ├── ScaffoldingDoc.md
│   ├── TechnicalDoc.md
│   └── template_mid.postman_collection.json
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   ├── db.ts
│   │   └── index.ts
│   ├── controllers/
│   │   ├── adminController.ts
│   │   ├── authController.ts
│   │   ├── bagController.ts
│   │   ├── imageController.ts
│   │   ├── publicBagController.ts
│   │   ├── resourceController.ts
│   │   ├── uploadController.ts
│   │   └── userController.ts
│   ├── docs/
│   │   └── swagger.ts
│   ├── middlewares/
│   │   ├── authenticateToken.ts
│   │   ├── errorHandler.ts
│   │   ├── multerMiddleware.ts
│   │   ├── notFound.ts
│   │   ├── requireAdmin.ts
│   │   ├── restrictSuspendedUsers.ts
│   │   └── uploadMiddleware.ts
│   ├── models/
│   │   ├── Bag.ts
│   │   ├── Resource.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── adminRoutes.ts
│   │   ├── authRoutes.ts
│   │   ├── bagRoutes.ts
│   │   ├── resourceRoutes.ts
│   │   ├── uploadRoutes.ts
│   │   └── userRoutes.ts
│   ├── services/
│   │   ├── aiClient.ts
│   │   ├── aiService.ts
│   │   ├── authService.ts
│   │   ├── cloudinaryUploadService.ts
│   │   ├── imageUploadService.ts
│   │   └── localUploadService.ts
│   ├── types/
│   │   ├── adminTypes.ts
│   │   ├── bagTypes.ts
│   │   ├── commonTypes.ts
│   │   ├── imageTypes.ts
│   │   ├── resourceTypes.ts
│   │   └── userTypes.ts
│   └── utils/
│       ├── AppError.ts
│       ├── assertBagQuantity.ts
│       ├── bagQueryUtils.ts
│       ├── cookieUtils.ts
│       └── verifyUser.ts
└── uploads/ (runtime, for local image storage)
```

## 2. Key Architecture and Interactions

### Authentication

- **Clerk** is used for authentication and user management. All protected routes use the `authenticateToken` middleware, which validates Clerk sessions/tokens.
- User data and session management are handled via `clerkClient.ts` and related services/middleware.
- No custom JWT logic; Clerk manages all user auth flows.

### Models, Types, and CRUD (Parent Entities: Bags)

- **Model**: `Bag.ts` defines the Mongoose schema for Bag entities.
- **Types**: `bagTypes.ts` contains Zod schemas and TypeScript types for validation and type safety.
- **CRUD**: `bagController.ts` implements create, read, update, and delete logic for Bags. Routes are defined in `bagRoutes.ts`.
- **Validation**: All input is validated using Zod schemas before processing.

### Models, Types, and CRUD (Child Entities: Resources)

- **Model**: `Resource.ts` defines the Mongoose schema for Resource entities, which are typically linked to Bags.
- **Types**: `resourceTypes.ts` contains Zod schemas and TypeScript types for Resources.
- **CRUD**: `resourceController.ts` handles CRUD operations for Resources. Routes are in `resourceRoutes.ts`.
- **Validation**: Zod schemas ensure only valid data is processed.

### User Management

- **Model**: `User.ts` defines the Mongoose schema for users, including password hashing (if used).
- **Types**: `userTypes.ts` provides Zod schemas and types for user data.
- **Controllers/Services**: `authController.ts` and `userController.ts` manage registration, login, profile, and self-management endpoints. `authService.ts` and `clerkClient.ts` provide business logic and Clerk integration.
- **Admin**: `adminController.ts` and `adminRoutes.ts` provide admin-only user/resource management.

### Component Interactions

- **Request Flow**: Client → Route → Middleware (auth, validation, error handling) → Controller → Service/Model → Response.
- **Parent/Child Relationship**: Bags (parent) can have Resources (child). Controllers and models are designed to reflect this relationship, with Resources referencing their parent Bag. Cascading deletes of Resources are handled in the `Bag.ts` via mongoose pre delete hooks to remove all associated Resources when a Bag is deleted. Same for cascading deletes of Bags when a User is deleted.
- **Validation**: All data entering the system is validated at the controller/service boundary using Zod schemas.
- **Services**: Business logic, third-party integrations (AI, Cloudinary, Clerk), and database access are encapsulated in the `services/` layer.

### Modularity and Centralized Error Handling

- **Separation of Concerns**: Each concern (controllers, models, routes, services, types, utils) is isolated for clarity and scalability.
- **Centralized Error Handling**: All errors are funneled through the `errorHandler.ts` middleware and use custom error classes from `AppError.ts` for consistent responses.
- **Reusable Middleware**: Authentication, authorization, file upload, and error handling are implemented as modular middleware.
- **Extensibility**: New entities/modules can be added by replicating the Bag/Resource pattern (model, types, controller, routes, service, middleware).

---

This document provides a concise technical overview of the architecture, key flows, and modularity of the codebase. Use it as a reference for understanding, extending, and maintaining the application.
