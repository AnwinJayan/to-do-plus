import { Outlet } from "react-router-dom";
import Navbar from "../features/common/components/Navbar";
import Sidebar from "../features/common/components/Sidebar";
import ErrorBoundary from "../features/common/components/ErrorBoundary";

export default function DashboardLayout() {
  return (
    <ErrorBoundary>
      <div className="drawer lg:drawer-open h-screen">
        <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col h-screen overflow-hidden">
          <Navbar />
          <main className="flex-1 p-3 bg-base-200 overflow-auto">
            <Outlet />
          </main>
        </div>
        <Sidebar />
      </div>
    </ErrorBoundary>
  );
}
