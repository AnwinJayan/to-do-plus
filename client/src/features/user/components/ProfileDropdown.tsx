import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../store";
import LogoutButton from "../../auth/components/LogoutButton";

export default function ProfileDropdown() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <ul
      tabIndex={0}
      className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4"
    >
      <li className="menu-title px-4 py-2 select-none">
        <div className="select-none">Signed in as</div>
        <div className="font-bold select-none">{user.username}</div>
      </li>
      <li>
        <Link to="/account/view">Account</Link>
      </li>
      {user.role === "admin" && (
        <li>
          <Link to="/admin">Admin Dashboard</Link>
        </li>
      )}
      <div className="divider my-0"></div>
      <li>
        <LogoutButton />
      </li>
    </ul>
  );
}
