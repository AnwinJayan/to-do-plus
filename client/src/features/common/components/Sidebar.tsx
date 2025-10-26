import { NavLink, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { FaRegFolder } from "react-icons/fa6";
import { PiGearBold } from "react-icons/pi";
import { MdArrowForwardIos } from "react-icons/md";
import CreateListBox from "../../lists/components/CreateListBox";
import { useState } from "react";
import { createList, createListWithAI } from "../../lists/listApi";

export default function Sidebar() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [externalError, setExternalError] = useState<string | undefined>();
  const navigate = useNavigate();

  function closeDrawer() {
    if (typeof window !== "undefined") {
      const drawerToggle = document.getElementById(
        "drawer-toggle"
      ) as HTMLInputElement | null;
      if (drawerToggle) drawerToggle.checked = false;
    }
  }

  async function handleBlankListSubmit(data: { title: string }) {
    setIsSubmitting(true);
    setExternalError(undefined);
    try {
      const newList = await createList(data);
      navigate(`/lists/${newList._id}`);
      closeDrawer();
    } catch (err: any) {
      setExternalError(err.message);
      setTimeout(() => setExternalError(undefined), 4000);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAIListSubmit(data: { prompt: string }) {
    setIsSubmitting(true);
    setExternalError(undefined);
    try {
      const newList = await createListWithAI(data);
      navigate(`/lists/${newList._id}`);
      closeDrawer();
    } catch (err: any) {
      setExternalError(err.message);
      setTimeout(() => setExternalError(undefined), 4000);
    } finally {
      setIsSubmitting(false);
    }
  }

  const mainLinks = [
    {
      to: "/lists",
      label: "My Lists",
      icon: <FaRegFolder className="w-5 h-5 stroke-current" />,
      matchPaths: ["/lists", "/"],
    },
  ];

  const settingsLink = {
    to: "/settings",
    label: "Settings",
    icon: <PiGearBold className="w-5 h-5 stroke-current" />,
  };

  return (
    <div className="drawer-side z-20">
      <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
      <aside className="w-80 min-h-screen bg-base-100 flex flex-col relative">
        {/* Close button for mobile */}
        <button
          className="absolute right-2 top-2 btn btn-sm btn-circle btn-ghost md:hidden"
          aria-label="Close sidebar"
          type="button"
          onClick={closeDrawer}
        >
          <FaTimes className="w-5 h-5" />
        </button>
        {/* Logo/App name section */}
        <div className="px-6 py-4 border-b border-base-content/10">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <GrResources className="inline-block w-6 h-6 text-primary" />
            Resource Manager
          </h1>
        </div>

        {/* Navigation menu */}
        <div className="px-4 py-6 flex-1">
          <ul className="flex flex-col gap-2 w-full">
            {mainLinks.map(({ to, label, icon, matchPaths }) => {
              const isActive = matchPaths
                ? matchPaths.includes(window.location.pathname)
                : to === window.location.pathname;
              return (
                <li key={to} className="w-full">
                  <NavLink
                    to={to}
                    className={({ isActive: navIsActive }) =>
                      [
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg",
                        "transition-colors duration-200 ease-in-out",
                        navIsActive || isActive
                          ? "font-semibold text-primary bg-base-200/70 shadow"
                          : "hover:bg-base-200 active:bg-base-300 focus:bg-base-200/80",
                      ].join(" ")
                    }
                    onClick={closeDrawer}
                  >
                    {icon}
                    <span className="flex-1 text-base">{label}</span>
                    {isActive && (
                      <MdArrowForwardIos className="w-5 h-5 text-primary" />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
          {/* Create List Box below navigation */}
          <CreateListBox
            onSubmitBlank={handleBlankListSubmit}
            onSubmitAI={handleAIListSubmit}
            isSubmitting={isSubmitting}
            externalError={externalError}
          />
        </div>

        {/* Settings at the bottom */}
        <div className="px-4 pb-6">
          <ul className="flex flex-col w-full">
            <li className="w-full">
              <NavLink
                to={settingsLink.to}
                className={({ isActive }) =>
                  [
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg",
                    "transition-colors duration-200 ease-in-out",
                    isActive
                      ? "font-semibold text-primary bg-base-200/70 shadow"
                      : "hover:bg-base-200 active:bg-base-300 focus:bg-base-200/80",
                  ].join(" ")
                }
                onClick={closeDrawer}
              >
                {settingsLink.icon}
                <span className="flex-1 text-base">{settingsLink.label}</span>
                {settingsLink.to === window.location.pathname && (
                  <MdArrowForwardIos className="w-5 h-5 text-primary" />
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
