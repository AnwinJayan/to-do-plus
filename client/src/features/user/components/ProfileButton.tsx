import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import ProfileDropdown from "./ProfileDropdown";

export default function ProfileButton() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt={`${user.username}'s profile`} />
          ) : (
            <div className="bg-primary text-primary-content w-full h-full flex items-center justify-center">
              <span className="text-xl font-semibold">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
          )}
        </div>
      </div>
      <ProfileDropdown />
    </div>
  );
}
