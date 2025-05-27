// src/components/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

// Icons
const DashboardIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h7"
    ></path>
  </svg>
);

const ProductsIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    ></path>
  </svg>
);

const OrdersIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    ></path>
  </svg>
);

const CustomersIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    ></path>
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    ></path>
  </svg>
);

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active section based on URL path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes("/customers")) return "customers";
    if (path.includes("/products")) return "products";
    if (path.includes("/orders")) return "orders";
    if (path.includes("/settings")) return "settings";
    return "dashboard";
  };

  const activeSection = getActiveSection();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {/* Desktop sidebar (always visible on larger screens) */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component */}
          <div className="flex flex-col h-0 flex-1 bg-indigo-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-white text-2xl font-bold">P and M Admin</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  className={`${
                    activeSection === "dashboard"
                      ? "bg-indigo-900 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <DashboardIcon />
                  <span className="ml-3">Dashboard</span>
                </Link>

                {/* Products */}
                <Link
                  to="/products"
                  className={`${
                    activeSection === "products"
                      ? "bg-indigo-900 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <ProductsIcon />
                  <span className="ml-3">Products</span>
                </Link>

                {/* Orders */}
                <Link
                  to="/orders"
                  className={`${
                    activeSection === "orders"
                      ? "bg-indigo-900 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <OrdersIcon />
                  <span className="ml-3">Orders</span>
                </Link>

                {/* Customers */}
                <Link
                  to="/customers"
                  className={`${
                    activeSection === "customers"
                      ? "bg-indigo-900 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <CustomersIcon />
                  <span className="ml-3">Customers</span>
                </Link>

                {/* Settings */}
                <Link
                  to="/settings"
                  className={`${
                    activeSection === "settings"
                      ? "bg-indigo-900 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <SettingsIcon />
                  <span className="ml-3">Settings</span>
                </Link>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-indigo-700 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center">
                  <div>
                    <svg
                      className="h-9 w-9 text-indigo-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Admin</p>
                    <p className="text-xs font-medium text-indigo-200 group-hover:text-white">
                      Sign out
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`md:hidden fixed inset-0 flex z-40 ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        {/* Sidebar backdrop overlay */}
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* Sidebar panel */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile sidebar content - same as desktop but in mobile view */}
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-white text-xl font-bold">P and M Admin</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {/* Same navigation links as desktop */}
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={`${
                  activeSection === "dashboard"
                    ? "bg-indigo-900 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                onClick={() => setSidebarOpen(false)}
              >
                <DashboardIcon />
                <span className="ml-3">Dashboard</span>
              </Link>

              {/* Products */}
              <Link
                to="/products"
                className={`${
                  activeSection === "products"
                    ? "bg-indigo-900 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                onClick={() => setSidebarOpen(false)}
              >
                <ProductsIcon />
                <span className="ml-3">Products</span>
              </Link>

              {/* Orders */}
              <Link
                to="/orders"
                className={`${
                  activeSection === "orders"
                    ? "bg-indigo-900 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                onClick={() => setSidebarOpen(false)}
              >
                <OrdersIcon />
                <span className="ml-3">Orders</span>
              </Link>

              {/* Customers */}
              <Link
                to="/customers"
                className={`${
                  activeSection === "customers"
                    ? "bg-indigo-900 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                onClick={() => setSidebarOpen(false)}
              >
                <CustomersIcon />
                <span className="ml-3">Customers</span>
              </Link>

              {/* Settings */}
              <Link
                to="/settings"
                className={`${
                  activeSection === "settings"
                    ? "bg-indigo-900 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                onClick={() => setSidebarOpen(false)}
              >
                <SettingsIcon />
                <span className="ml-3">Settings</span>
              </Link>
            </nav>
          </div>

          {/* Mobile user/logout section */}
          <div className="flex-shrink-0 flex border-t border-indigo-700 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 group block w-full"
            >
              <div className="flex items-center">
                <div>
                  <svg
                    className="h-9 w-9 text-indigo-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Admin</p>
                  <p className="text-xs font-medium text-indigo-200 group-hover:text-white">
                    Sign out
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile header with toggle button */}
      <div className="sticky top-0 z-10 md:hidden flex items-center bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
          P and M Admin
        </h1>
      </div>
    </>
  );
}

export default Sidebar;
