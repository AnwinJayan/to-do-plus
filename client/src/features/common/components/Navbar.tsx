import { useLocation, useNavigate } from "react-router-dom";
import ThemeSwitch from "./ThemeSwitch";
import { FaBars } from "react-icons/fa";
import { FaChevronCircleLeft } from "react-icons/fa";
import ProfileButton from "../../user/components/ProfileButton";

const pathTitleMap: { pattern: RegExp; title: string }[] = [
  { pattern: /^\/$/, title: "My Lists" },
  { pattern: /^\/lists$/, title: "My Lists" },
  { pattern: /^\/lists\/[^/]+$/, title: "List Details" },
  { pattern: /^\/resources$/, title: "My Resources" },
  { pattern: /^\/bags\/public$/, title: "Browse Bags" },
  { pattern: /^\/bags\/new$/, title: "Create Bag" },
  { pattern: /^\/bags\/[^/]+\/edit$/, title: "Edit Bag" },
  { pattern: /^\/bags\/[^/]+\/resources$/, title: "Bag Resources" },
  { pattern: /^\/account\/*/, title: "Account" },
  {
    pattern: /^\/bags\/public\/[^/]+\/resources$/,
    title: "Public Bag Resources",
  },
  { pattern: /^\/bags\/[^/]+\/resources\/new$/, title: "Create Resource" },
  { pattern: /^\/resources\/[^/]+$/, title: "Resource Details" },
  { pattern: /^\/resources\/[^/]+\/edit$/, title: "Edit Resource" },
  { pattern: /^\/settings$/, title: "Settings" },
  { pattern: /^\/profile$/, title: "Profile" },
  { pattern: /^\/login$/, title: "Login" },
  { pattern: /^\/register$/, title: "Register" },
  { pattern: /^\/admin$/, title: "Admin Dashboard" },
  { pattern: /^\/*$/, title: "Not Found" }, // fallback for 404
];

function getTitleFromPath(pathname: string): string {
  const found = pathTitleMap.find(({ pattern }) => pattern.test(pathname));
  return found ? found.title : "App";
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = getTitleFromPath(location.pathname);

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 h-16">
      <div className="flex-none flex items-center gap-2">
        {/* Drawer toggle for mobile */}
        <label
          htmlFor="drawer-toggle"
          className="btn btn-square btn-ghost lg:hidden"
        >
          <FaBars className="h-5 w-5" />
        </label>
        {/* Go Back button, hidden on root */}
        {location.pathname !== "/" && (
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm"
            aria-label="Go Back"
          >
            <FaChevronCircleLeft className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="flex-1">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex-none flex items-center gap-2">
        <ThemeSwitch />
        <ProfileButton />
      </div>
    </div>
  );
}
