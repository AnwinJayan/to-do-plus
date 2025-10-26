### 1. Create List and Task Feature Structure

**Goal:** Scaffold separate feature directories for lists and tasks with required subfolders and files  
**Reference:** `features/bags` and `features/resources`  
**Files to Create:**

- `src/features/lists/listApi.ts`
- `src/features/lists/listTypes.ts`
- `src/features/lists/components/`
- `src/features/lists/pages/`
- `src/features/tasks/taskApi.ts`
- `src/features/tasks/taskTypes.ts`
- `src/features/tasks/components/`
- `src/features/tasks/pages/`

**Implementation Notes:**

- For lists, follow patterns from `bagTypes.ts` and `bagApi.ts`
- For tasks, follow patterns from `resourceTypes.ts` and `resourceApi.ts`
- Use Zod schemas for validation in both features

### 2. Implement List and Task Types

**Goal:** Define TypeScript interfaces and Zod schemas for lists and tasks  
**Reference:** `bagTypes.ts` and `resourceTypes.ts`  
**Files to Edit:**

- `src/features/lists/listTypes.ts`
- `src/features/tasks/taskTypes.ts`

**Implementation Notes:**

- In `listTypes.ts`, create interfaces and schemas for List entities
- In `taskTypes.ts`, create interfaces and schemas for Task entities
- Include API response types matching backend structure

### 3. Build List and Task API Modules

**Goal:** Create API functions for CRUD operations for both lists and tasks  
**Reference:** `bagApi.ts`, `resourceApi.ts`, and `apiUtils.ts`  
**Files to Edit:**

- `src/features/lists/listApi.ts`
- `src/features/tasks/taskApi.ts`

**Implementation Notes:**

- Implement CRUD functions for lists in `listApi.ts`
- Implement CRUD functions for tasks in `taskApi.ts`
- Use `handleApiRequest` from `apiUtils.ts` for error handling
- Include query param handling for sorting/filtering

### 4. Create UI Components

**Goal:** Build reusable components for lists and tasks using template patterns  
**Reference:** `BagCard.tsx` and `GenericForm.tsx`  
**Files to Create:**

```
src/features/lists/components/
    ├── ListCard.tsx
    ├── NewListForm.tsx
    └── SortControls.tsx

src/features/tasks/components/
    ├── TaskItem.tsx
    └── TaskForm.tsx
```

**Implementation Notes:**

- **ListCard:** Mirror `BagCard.tsx` layout with favorite toggle and controls
- **TaskItem:** Use checkbox and drag handle, following template patterns
- **Forms:** Extend `GenericForm.tsx` with feature-specific fields and Zod validation
- **SortControls:** Replicate filter pattern from `GenericFilters.tsx`

### 5. Implement Page Components

**Goal:** Create route-level page components for lists and tasks  
**Reference:** `BagListPage.tsx` and `BagResourceListPage.tsx`  
**Files to Create:**

```
src/features/lists/pages/
    ├── ListListPage.tsx
    └── ListViewPage.tsx
```

**Implementation Notes:**

- **ListListPage:** Display grid of `ListCard` components, include `NewListForm` and `SortControls`
- **ListViewPage:** Show tasks for a list using `TaskItem` components and `TaskForm`

### 6. Configure Routing

**Goal:** Register new routes for lists and tasks in application router  
**Reference:** `router/index.tsx`  
**Files to Edit:**

- `src/router/index.tsx`

**Implementation Notes:**

- Add routes:
  ```tsx
  {
      path: "/lists",
      element: <ListListPage />,
  },
  {
      path: "/lists/:id",
      element: <ListViewPage />,
  }
  ```
- Protect routes using `ProtectedRoute` component
- Set root path (`/`) to redirect to `/lists`

### 7. Update Navigation

**Goal:** Add list and task links to main navigation  
**Reference:** `Navbar.tsx` and `Sidebar.tsx`  
**Files to Edit:**

- `src/features/common/components/Navbar.tsx`
- `src/features/common/components/Sidebar.tsx`

**Implementation Notes:**

- Add "Lists" navigation item pointing to `/lists`
- Optionally add "Tasks" navigation if direct access is needed
- Include icons and active state styling per template

### 8. Implement State Management

**Goal:** Add Redux slices for list and task state  
**Reference:** `userSlice.ts` and `authSlice.ts`  
**Files to Create:**

- `src/features/lists/listSlice.ts`
- `src/features/tasks/taskSlice.ts`

**Implementation Notes:**

- Define state structure for lists and tasks separately
- Create reducers for adding/updating lists and tasks, toggling favorites, reordering tasks
- Connect to API using thunk patterns from `authSlice.ts`

### 9. Add Toast Notifications

**Goal:** Implement user feedback for list and task actions  
**Reference:** `apiUtils.ts` error handling  
**Implementation Notes:**

- Success messages for list/task creation, deletion, completion, favorite toggling
- Error messages for failed API calls
- Use duration and styling from existing toast system

---

## Change Tracking Summary

### Created Files:

```
src/features/lists/
    ├── listApi.ts
    ├── listTypes.ts
    ├── listSlice.ts
    ├── components/
    │   ├── ListCard.tsx
    │   ├── NewListForm.tsx
    │   └── SortControls.tsx
    └── pages/
            ├── DashboardPage.tsx
            └── ListDetailPage.tsx

src/features/tasks/
    ├── taskApi.ts
    ├── taskTypes.ts
    ├── taskSlice.ts
    ├── components/
    │   ├── TaskItem.tsx
    │   └── TaskForm.tsx
    └── pages/
            └── TaskDetailPage.tsx (optional)
```

### Modified Files:

```
src/router/index.tsx
src/features/common/components/Navbar.tsx
src/features/common/components/Sidebar.tsx
src/features/pageIndex.ts
```

### Features Implemented:

1. Authentication via Clerk (reused)
2. List management dashboard
3. Task management view
4. CRUD operations for lists
5. CRUD operations for tasks
6. AI list generation (if applicable)
7. Favorites system for lists
8. Sorting controls for lists
9. Drag-and-drop tasks (optional)
10. Toast notification system
11. Responsive layouts

---

## Completion Checklist

- [ ] All feature files created with proper structure for lists and tasks
- [ ] Type definitions match API documentation
- [ ] API functions implement all required endpoints for both features
- [ ] Components reuse template patterns/styles
- [ ] Pages implement responsive layouts
- [ ] Routes properly registered and protected
- [ ] Navigation includes all list/task features
- [ ] State management handles all UI states
- [ ] Toast notifications provide user feedback
- [ ] All interactions work without console errors
- [ ] Tailwind styling matches template design system
- [ ] Zod validation implemented in all forms
- [ ] Error handling follows apiUtils patterns
- [ ] Clerk authentication integrated properly
- [ ] Drag-and-drop implemented (if included)

All instructions follow the template's component architecture, routing patterns, and styling approach. The implementation strictly reuses existing abstractions like GenericForm, ProtectedRoute, and API utilities, but splits lists and tasks into separate features.
