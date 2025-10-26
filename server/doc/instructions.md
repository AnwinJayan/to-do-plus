# To-Do Application Backend Instructions

These steps guide you through building the To-Do application backend, following the template's patterns and requirements.

---

## 1. Create List and Task Models

Create Mongoose models for List and Task based on the Bag/Resource pattern:

### List Model (`src/models/List.ts`)

- Structure: Follow `Bag.ts` pattern
- Fields:
  - `title`: string (required)
  - `isFavorited`: boolean (default: false)
  - `created_at`: Date (default: Date.now)
  - `modified_at`: Date (default: Date.now)
  - `userId`: ObjectId (ref: 'User', required)

### Task Model (`src/models/Task.ts`)

- Structure: Follow `Resource.ts` pattern
- Fields:
  - `title`: string (required)
  - `completed`: boolean (default: false)
  - `position`: number (required)
  - `listId`: ObjectId (ref: 'List', required)
  - `userId`: ObjectId (ref: 'User', required)

### Cascade Hooks

- In `List.ts`: Add pre-delete hook to delete associated tasks
- In `User.ts`: Add pre-delete hook to delete associated lists/tasks

### Validation

- After creation, verify:
  - Models match template's schema patterns
  - Cascade hooks are implemented
  - References use correct model names

### Assumptions

- Use same Date handling as Bag's timestamps
- Position field uses template's numeric sorting pattern
- Cascade hooks follow Resource/Bag relationship logic

---

## 2. Create Type Definitions

Create Zod schemas and TypeScript types following template patterns:

### List Types (`src/types/listTypes.ts`)

- Structure: Match `bagTypes.ts`
- Schemas:
  - `ListSchema` (Zod object with fields matching model)
  - `CreateListInput` (`title`, `isFavorited`)
  - `UpdateListInput` (`title`, `isFavorited`)

### Task Types (`src/types/taskTypes.ts`)

- Structure: Match `resourceTypes.ts`
- Schemas:
  - `TaskSchema` (all fields)
  - `CreateTaskInput` (`title`, `listId`, `userId`)
  - `UpdateTaskInput` (`title`, `completed`, `position`)

### Validation

- Verify schemas match template's Zod implementation
- Ensure all input types extend template's BaseParams
- Confirm `userId`/`listId` use `Zod.objectId()` validation

### Assumptions

- Use same Zod configuration as template
- Error messages follow template's validation patterns

---

## 3. Create List Controller

Implement List controller based on `bagController.ts`:

**File:** `src/controllers/listController.ts`

**Methods:**

- `createList` (manual creation)
- `createListWithAI` (AI-generated)
- `getUserLists`
- `getListById`
- `updateList`
- `deleteList`
- `deleteAllLists`

**Patterns:**

- Use try/catch with `AppError`
- Validate inputs with `listTypes` schemas
- For AI generation: call `aiService.generateList(prompt)`
- For `deleteAllLists`: use template's bulk operation pattern

**AI Integration:**

- Follow `aiService` pattern from template
- New method in `aiService`: `generateList(prompt)`

**Validation:**

- Confirm all methods follow template's controller structure
- Error handling matches `AppError` usage
- AI method properly handles Gemini API calls

---

## 4. Create Task Controller

Implement Task controller based on `resourceController.ts`:

**File:** `src/controllers/taskController.ts`

**Methods:**

- `createTask`
- `getTasksByList`
- `getTaskById`
- `updateTask`
- `deleteTask`

**Patterns:**

- Position handling: use template's `queryUtils` for ordering
- Ownership checks: `verifyUser` from utils
- Update method: allow partial updates like `resourceController`

**Validation:**

- All methods follow template's CRUD patterns
- Proper `listId` validation and existence checks
- Position updates maintain sort order

---

## 5. Create Routes

Implement routes following template's routing pattern:

### List Routes (`src/routes/listRoutes.ts`)

```ts
router.post("/", [validate(createListInput)], createList);
router.post("/ai", [validate(aiPromptInput)], createListWithAI);
router.get("/", getUserLists);
router.get("/:id", getListById);
router.patch("/:id", [validate(updateListInput)], updateList);
router.delete("/:id", deleteList);
router.delete("/", deleteAllLists);
```

### Task Routes (`src/routes/taskRoutes.ts`)

```ts
router.post("/", [validate(createTaskInput)], createTask);
router.get("/:listId", getTasksByList);
router.get("/id/:id", getTaskById);
router.patch("/:id", [validate(updateTaskInput)], updateTask);
router.delete("/:id", deleteTask);
```

### Middleware

- Apply `authenticateToken` and `restrictSuspendedUsers` to all routes
- Add OpenAPI documentation using template's JSDoc format

### Validation

- Confirm route structure matches template
- Middleware applied consistently
- Parameter names match requirement document

---

## 6. Implement AI Service

Extend AI service for list generation:

**File:** `src/services/aiService.ts`

**New Method:**

```ts
generateList = async (
  prompt: string
): Promise<{ title: string; tasks: string[] }> => {
  // Use Gemini API similar to existing AI methods
  // Return structured {title, tasks} object
};
```

**Validation:**

- Follows template's AI service patterns
- Proper error handling for API failures
- Returns data in required format for controller

**Assumptions:**

- Use same Gemini client setup as template
- Prompt engineering returns parsable JSON

---

## 7. Register Routes and Final Setup

Complete the integration:

### Register Routes (`src/app.ts`)

```ts
import listRouter from "./routes/listRoutes";
import taskRouter from "./routes/taskRoutes";

apiRouter.use("/list", listRouter);
apiRouter.use("/task", taskRouter);
```

### Update Docs

- Add OpenAPI comments to all route handlers
- Maintain template's documentation standards

### Validation

- All endpoints match requirement document
- Test cascade deletes (user → lists → tasks)
- Verify AI-generated list creates proper tasks

---

## Completion Summary

**Implemented Features:**

- User authentication (via Clerk template)
- List CRUD operations with manual/AI creation
- Task management with position ordering
- Cascade delete functionality
- AI integration with Gemini API
- Full type safety with Zod validation

**Verification Checklist:**

- [ ] All models follow template patterns
- [ ] Controllers implement proper error handling
- [ ] Routes match requirement specifications
- [ ] AI service returns structured todo lists
- [ ] Cascade deletes work as expected
- [ ] OpenAPI documentation complete

The backend now fully implements the required to-do functionality while maintaining the template's architectural patterns. Let me know if you need any adjustments or additional features!

```

```
