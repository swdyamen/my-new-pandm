// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import CustomerJobs from "./pages/CustomerJobs";
import AuthGuard from "./components/AuthGuard";
import Layout from "./components/Layout";

// Get the base URL from the environment variable
const baseUrl = import.meta.env.VITE_BASE_URL || "/pandm/";

function App() {
  return (
    <BrowserRouter
      basename={baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl}
    >
      <Routes>
        <Route
          path="/login"
          element={
            <AuthGuard requireAuth={false}>
              <Login />
            </AuthGuard>
          }
        />

        {/* Protected routes with shared layout */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/customers"
            element={
              <AuthGuard>
                <Customers />
              </AuthGuard>
            }
          />
          <Route
            path="/products"
            element={
              <AuthGuard>
                <Products />
              </AuthGuard>
            }
          />
          <Route
            path="/orders"
            element={
              <AuthGuard>
                <Orders />
              </AuthGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            }
          />
          <Route
            path="/customers/:customerId/jobs"
            element={
              <AuthGuard>
                <CustomerJobs />
              </AuthGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
