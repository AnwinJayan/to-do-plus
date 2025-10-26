# Scaffolding Guide: Adding New Entities and Features

This guide explains how to add a new parent entity (e.g., `Bag`) or a child entity (e.g., `Resource`) to the codebase, following the established modular, type-safe, and maintainable patterns.

---

## 1. Overview: Entity Structure

Each entity consists of:

- **Model**: Mongoose schema/model (`src/models/`)
- **Types/Schemas**: Zod schemas and TypeScript types (`src/types/`)
- **Controller**: Business logic and request handlers (`src/controllers/`)
- **Routes**: API endpoints (`src/routes/`)
- **(Optional) Service**: Business logic, integrations, or utilities (`src/services/`)
- **(Optional) Middleware**: Entity-specific middleware (`src/middlewares/`)

---

## 2. Step-by-Step: Creating a Parent Entity

### Step 1: Define the Model

- **File**: `src/models/YourEntity.ts`
- **Action**: Copy the structure from `Bag.ts`. Define fields, types, and validation as needed.

### Step 2: Define Types and Validation Schemas

- **File**: `src/types/yourEntityTypes.ts`
- **Action**: Use Zod to define validation schemas and TypeScript types, referencing `bagTypes.ts` for structure and conventions.

### Step 3: Implement the Controller

- **File**: `src/controllers/yourEntityController.ts`
- **Action**: Implement CRUD and business logic. Use Zod schemas for input validation. Reference `bagController.ts` for patterns.

### Step 4: Create Routes

- **File**: `src/routes/yourEntityRoutes.ts`
- **Action**: Define Express routes and link to controller methods. Add OpenAPI JSDoc comments for Swagger docs. Reference `bagRoutes.ts`.

### Step 5: (Optional) Add Services

- **File**: `src/services/yourEntityService.ts`
- **Action**: If the entity requires business logic, integrations, or utilities, encapsulate them in a service. Reference `imageUploadService.ts` or `aiService.ts`.

### Step 6: (Optional) Add Middleware

- **File**: `src/middlewares/`
- **Action**: If needed, add entity-specific middleware (e.g., validation, authorization).

### Step 7: Register the Routes

- **File**: `src/app.ts`
- **Action**: Import and register the new router with the main API router. Example:
  ```typescript
  import yourEntityRouter from "./routes/yourEntityRoutes.js";
  apiRouter.use(
    "/your-entities",
    authenticateToken,
    restrictSuspendedUsers,
    yourEntityRouter
  );
  ```

### Step 8: Update API Documentation

- **File**: `src/routes/yourEntityRoutes.ts` (JSDoc comments)
- **Action**: Add `@openapi` comments to each route for Swagger docs.

---

## 3. Creating a Child Entity (e.g., Resource)

Follow the same steps as above, but design the model to reference its parent (e.g., `bagId` for resources). Reference `Resource.ts`, `resourceTypes.ts`, `resourceController.ts`, and `resourceRoutes.ts` for patterns.

---

## 4. Best Practices

- **Validation**: Always validate input using Zod schemas before processing.
- **Type Safety**: Use TypeScript types/interfaces for all data structures.
- **Error Handling**: Throw custom errors from `AppError.ts` for all error cases.
- **Modularity**: Keep controllers thin; move business logic to services when possible.
- **Documentation**: Document all routes with OpenAPI JSDoc comments.
- **Testing**: Add tests for new controllers/services if test setup exists.

---

## 5. Example References

- **Bag Example**:
  - Model: `src/models/Bag.ts`
  - Types: `src/types/bagTypes.ts`
  - Controller: `src/controllers/bagController.ts`
  - Routes: `src/routes/bagRoutes.ts`
- **Resource Example**:
  - Model: `src/models/Resource.ts`
  - Types: `src/types/resourceTypes.ts`
  - Controller: `src/controllers/resourceController.ts`
  - Routes: `src/routes/resourceRoutes.ts`

---

This guide ensures new features are added consistently, safely, and in line with the template’s architecture and best practices.
