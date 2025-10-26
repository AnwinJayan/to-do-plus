# Scaffolding Guide: Creating New Features

This guide outlines the process for adding a new feature (e.g., a "ToDo" module) to the codebase. Reference the existing `bags` and `resources` features for patterns and file structure.

---

## 1. Plan Your Feature

- Define the domain, entities, and required UI (list, create, edit, delete, detail pages).

## 2. Scaffold the Feature Directory

- Create a new folder under `src/features/` (e.g., `src/features/todo/`).
- Add:
  - `todoApi.ts` for API functions (see `bagApi.ts`, `resourceApi.ts`).
  - `todoTypes.ts` for types and Zod schemas (see `bagTypes.ts`, `resourceTypes.ts`).
  - `components/` for UI elements (see `BagCard.tsx`, `ResourceForm.tsx`).
  - `pages/` for route-level components (see `BagListPage.tsx`, `ResourceListPage.tsx`).

## 3. Implement API and Types

- Use the shared Axios instance (`lib/axios.ts`) and `handleApiRequest` utility (`lib/apiUtils.ts`).
- Define types and Zod schemas for validation.

## 4. Build UI Components

- Create reusable UI in `components/`.
- Use shared components from `common/components` (e.g., `GenericForm`, `ConfirmationDialog`, `Loader`).
- Use Zod schemas for form validation.

## 5. Create Pages

- Add route-level components in `pages/`.
- Fetch data using your API functions.
- Use shared layouts and error handling components.

## 6. Register Pages and Routing

- Export new pages in `features/pageIndex.ts` (see existing exports).
- Register routes in `router/index.tsx` (see how other features are registered).

## 7. Add Navigation Links

- Update `Sidebar.tsx` or `Navbar.tsx` to include links to your feature.
- Follow icon and label conventions from existing features.

## 8. Authentication with Clerk

- Use Clerk components and hooks for authentication (see `ClerkLoginPage.tsx`, `ClerkRegisterPage.tsx`, `ProtectedRoute.tsx`).
- Protect routes using `ProtectedRoute` and Clerk's wrappers.

## 9. (Optional) Add Redux Slice or Context

- If global state is needed, create a slice (see `userSlice.ts`, `authSlice.ts`) and register in `store.ts`.
- For cross-cutting concerns, use context (see `ThemeContext.tsx`).

## 10. Best Practices

- Follow naming and folder conventions.
- Use Zod for validation.
- Reuse shared components/utilities.
- Use Clerk for all authentication and user management flows.
