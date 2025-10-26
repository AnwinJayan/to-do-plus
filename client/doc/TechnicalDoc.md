# Technical Documentation: React + TypeScript Template

## 1. File and Folder Tree

```
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── App.tsx
│   ├── assets
│   │   ├── css
│   │   │   └── clerk-auth.css
│   │   └── react.svg
│   ├── contexts
│   │   └── ThemeContext.tsx
│   ├── features
│   │   ├── admin
│   │   │   ├── adminApi.ts
│   │   │   ├── adminTypes.ts
│   │   │   ├── components
│   │   │   │   ├── AdminDangerZone.tsx
│   │   │   │   ├── AdminUserCard.tsx
│   │   │   │   └── AdminUserList.tsx
│   │   │   └── pages
│   │   │       ├── AdminDashboardPage.tsx
│   │   │       └── UserSuspendedPage.tsx
│   │   ├── auth
│   │   │   ├── authApi.ts
│   │   │   ├── authSlice.ts
│   │   │   ├── authTypes.ts
│   │   │   ├── components
│   │   │   │   ├── AdminRoute.tsx
│   │   │   │   ├── LogoutButton.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   └── pages
│   │   │       ├── ClerkLoginPage.tsx
│   │   │       └── ClerkRegisterPage.tsx
│   │   ├── bags
│   │   │   ├── bagApi.ts
│   │   │   ├── bagTypes.ts
│   │   │   ├── components
│   │   │   │   ├── BagCard.tsx
│   │   │   │   └── BagForm.tsx
│   │   │   └── pages
│   │   │       ├── BagCreatePage.tsx
│   │   │       ├── BagEditPage.tsx
│   │   │       ├── BagListPage.tsx
│   │   │       └── PublicBagListPage.tsx
│   │   ├── common
│   │   │   ├── components
│   │   │   │   ├── ConfirmationDialog.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── GenericFilters.tsx
│   │   │   │   ├── GenericForm.tsx
│   │   │   │   ├── GlobalErrorDisplay.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── MultiPartGenericForm.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── OtpInput.tsx
│   │   │   │   ├── PaginationControls.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── ThemeSwitch.tsx
│   │   │   └── pages
│   │   │       └── NotFoundPage.tsx
│   │   ├── config
│   │   │   ├── components
│   │   │   │   ├── ThemeSelect.tsx
│   │   │   │   └── profileButton.tsx
│   │   │   └── pages
│   │   │       └── settings.tsx
│   │   ├── pageIndex.ts
│   │   ├── resources
│   │   │   ├── components
│   │   │   │   ├── ResourceCard.tsx
│   │   │   │   └── ResourceForm.tsx
│   │   │   ├── pages
│   │   │   │   ├── BagResourceListPage.tsx
│   │   │   │   ├── PublicBagResourceListPage.tsx
│   │   │   │   ├── ResourceCreatePage.tsx
│   │   │   │   ├── ResourceEditPage.tsx
│   │   │   │   └── ResourceListPage.tsx
│   │   │   ├── resourceApi.ts
│   │   │   └── resourceTypes.ts
│   │   └── user
│   │       ├── components
│   │       │   ├── AccountDeletionConfirmationDialogue.tsx
│   │       │   ├── AttemptEmailVerificationForm.tsx
│   │       │   ├── ChangeEmail.tsx
│   │       │   ├── ChangePasswordForm.tsx
│   │       │   ├── ChangeUserNameForm.tsx
│   │       │   ├── EmailVerificationForm.tsx
│   │       │   ├── ProfileButton.tsx
│   │       │   ├── ProfileDropdown.tsx
│   │       │   ├── ProfileImageUploadForm.tsx
│   │       │   ├── SendEmailVerificationForm.tsx
│   │       │   └── UserCard.tsx
│   │       ├── pages
│   │       │   ├── EditAccountDetailsPage.tsx
│   │       │   ├── ProfileDisplayPage.tsx
│   │       │   └── ProfilePage.tsx
│   │       ├── userApi.ts
│   │       ├── userSlice.ts
│   │       └── userTypes.ts
│   ├── hooks
│   │   └── PopupHook.tsx
│   ├── index.css
│   ├── layouts
│   │   ├── AuthLayout.tsx
│   │   └── DashboardLayout.tsx
│   ├── lib
│   │   ├── apiUtils.ts
│   │   ├── axios.ts
│   │   └── env.ts
│   ├── main.tsx
│   ├── router
│   │   └── index.tsx
│   ├── store.ts
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── yarn.lock
```

## 2. Application Overview & User Flow

This app uses a feature-first modular structure. Each domain (bags, resources, user, admin, auth, config) is self-contained under `features/`, with its own API, types, components, and pages. Shared logic and UI are in `common`, `lib`, and `hooks`.

### App Initialization & Routing

- The entry point (`main.tsx`) renders `App.tsx` inside a Redux `Provider`.
- `App.tsx` wraps the app in a `ThemeProvider`, sets up the router, and displays toast notifications.
- Routing is defined in `src/router/index.tsx` using React Router. Pages are imported from `features/*/pages` and registered in the router tree. Layouts (`DashboardLayout`, `AuthLayout`) provide consistent structure for main and auth pages.

### Authentication & User Flow

- Clerk is the sole authentication provider. All login, registration, and user management flows use Clerk's React SDK and API. JWT logic and custom auth endpoints are removed.
- Clerk's React components (`SignIn`, `SignUp`, `SignedIn`, `SignedOut`, `useClerk`, `useUser`, etc.) are used for authentication and user state. See `features/auth/pages/ClerkLoginPage.tsx`, `ClerkRegisterPage.tsx`, and `ProtectedRoute.tsx` for usage.
- Authenticated routes are protected using `ProtectedRoute` and Clerk's `SignedIn`/`SignedOut` wrappers. The Clerk publishable key is set in `.env` as `VITE_CLERK_PUBLISHABLE_KEY`.

### State Management & Data Flow

- Redux is used for global state (auth, user, etc.), with slices in `features/auth/authSlice.ts` and `features/user/userSlice.ts`. Clerk manages most auth state via hooks/context.
- Each feature has its own API file (e.g., `bagApi.ts`, `resourceApi.ts`) for server communication. API utilities in `lib/` handle error handling and toast integration.
- Types and Zod schemas per feature ensure runtime validation and type safety.

### UI, Forms, and Theming

- Shared UI components (modals, forms, dialogs, error boundaries, loaders, etc.) are in `features/common/components` and reused across features.
- Generic and multi-part form components use Zod schemas for validation and are used in feature forms.
- Theming is managed by `ThemeContext.tsx` and DaisyUI, with theme switching available throughout the app.

### Error Handling & Navigation

- `ErrorBoundary.tsx` catches React errors; `GlobalErrorDisplay.tsx` and API utilities handle API errors.
- Navigation is provided by `Navbar.tsx` and `Sidebar.tsx`, which update dynamically as features are added.

## 3. How Components Communicate

- **Pages**: Route-level views, each feature exposes its own pages. Pages use feature APIs to fetch/update data and dispatch Redux actions as needed.
- **Components**: Feature and shared components receive data and callbacks via props, and may use Redux or Clerk hooks for state.
- **APIs**: Each feature's API file handles server communication. API utilities provide error handling and toast notifications.
- **State**: Redux slices manage global state; Clerk manages authentication state. Components use selectors/hooks to access state.
- **Forms**: Use shared form components and Zod schemas for validation and submission.
- **Theming**: Theme context is provided at the app level and consumed by any component.

## 4. Typical User Flow

1. **User visits the app**: `main.tsx` renders the app, initializing Redux and theming.
2. **Authentication**: Unauthenticated users are shown Clerk login/register pages. On sign-in, Clerk manages user state and tokens.
3. **Navigation**: Authenticated users see the main dashboard layout, with navigation via sidebar/navbar.
4. **Feature Access**: Users interact with feature pages (bags, resources, admin, etc.), which fetch/update data via feature APIs. Forms use shared components and Zod validation.
5. **Error Handling**: Any API or React errors are caught and displayed via global error components.
6. **Theming**: Users can switch themes via the theme switcher, with the theme context updating app-wide styles.

## 5. Extending the App

- To add a feature: create a new folder under `features/`, add types, API, components, and pages. Register new pages in `features/pageIndex.ts` and `router/index.tsx`. Add navigation links as needed.
- Use shared abstractions (forms, modals, error boundaries, theme context) for consistency and rapid development.

---

This condensed documentation provides a high-level yet detailed overview of the app's structure, user flow, and how components and pages communicate, enabling developers to quickly understand and extend the project.
