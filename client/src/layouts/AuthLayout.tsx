import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { SignedIn } from "@clerk/clerk-react";
import "../assets/css/clerk-auth.css";

export default function AuthLayout() {
  return (
    <>
      <SignedIn>
        <Navigate to="/" replace />
      </SignedIn>
      <div className="container">
        <div className="auth-container">
          <Outlet />
        </div>
      </div>
    </>
  );
}
