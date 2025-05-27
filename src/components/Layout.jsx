// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="mx-auto px-3">
              <Outlet /> {/* This is where your page content will render */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
