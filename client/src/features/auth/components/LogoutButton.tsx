import { SignOutButton } from "@clerk/clerk-react";

export default function LogoutButton() {
  return (
    <SignOutButton redirectUrl="/sign-in">
      <button
        className="btn btn-outline btn-primary min-w-[80px]"
        type="button"
      >
        Logout
      </button>
    </SignOutButton>
  );
}
