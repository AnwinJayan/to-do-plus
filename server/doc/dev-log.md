# Development log

## 30-06-25

- created the models for List and Task

- Modified the User model to include pre-delete hooks for List and Task

- Updated the List model to include a pre-delete hook that deletes associated tasks

- Created Zod schemas and TypeScript types for List and Task

- Created the listController with basic CRUD operations

- Updated getUserLists in listController to provide filtering and sorting capabilities

- Created the taskController with basic CRUD operations + position management in relevant methods

- Updated listRoutes to include the new endpoints for List and Task

- Updated taskRoutes to include the new endpoints for Task

- improved prompt for auto generating lists with AI
