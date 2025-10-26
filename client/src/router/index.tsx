import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import AdminRoute from "../features/auth/components/AdminRoute";
import {
  NotFoundPage,
  SettingsPage,
  AdminDashboardPage,
  ClerkLoginPage,
  ClerkRegisterPage,
  ProfileDisplayPage,
  ListListPage,
  ListViewPage,
} from "../features/pageIndex";
import EditAccountDetailsPage from "../features/user/pages/EditAccountDetailsPage";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <ListListPage /> },
          { path: "lists", element: <ListListPage /> },
          { path: "lists/:id", element: <ListViewPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "account/view", element: <ProfileDisplayPage /> },
          { path: "account/edit", element: <EditAccountDetailsPage /> },
          {
            element: <AdminRoute />,
            children: [{ path: "admin", element: <AdminDashboardPage /> }],
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "sign-in/*", element: <ClerkLoginPage /> },
      { path: "sign-up/*", element: <ClerkRegisterPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
