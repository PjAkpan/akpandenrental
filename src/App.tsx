/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext"; // Import UserProvider and custom hook
import Home from "./pages/Home";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import Logout from "./Auth/Logout";
import ForgotPassword from "./Auth/ForgotPassword";
import VerifyOTP from "./Auth/Verify-otp";
import AnalyticsDashboard from "./pages/Dashboard";
import TenantManagement from "./Admin/Tenants";
import MaintenancePage from "./Admin/Maintenance";
import AdminChatInterface from "./Admin/AdminChatInterface";
import AdminPayment from "./Admin/Payments";
import AdminProfilePage from "./Admin/profile";
import { ProtectedRouteProps } from "./types";
import RoomManagement from "./Admin/Rooms";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import MaintenanceCustomer from "./Customer/Maintenance";
import PaymentCustomer from "./Customer/PaymentCustomer";
import ProfileCustomer from "./Customer/ProfileCustomer";
import ChatInterface from "./Customer/RequestStatus";
import CustomerDashboard from "./Customer/DashboardCustomer";
import Account from "./Customer/Account";
import CustomerReceipts from "./Customer/CustomerReceipts";
import TenancyReceipt from "./Admin/TenancyReceipt";


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ rolesRequired }) => {
  const { roles } = useUser(); // Use userRole from the context
 //const token = localStorage.getItem("token");
  console.log("User roles:", roles);
  console.log("Required roles for this route:", rolesRequired);

  if (!roles) {
    // Loading state when roles are not fetched yet
    return <div>Loading...</div>;
  }

  const userRolesSet = new Set(roles.map((role) => role.trim().toLowerCase()));
  const requiredRolesSet = new Set(
    rolesRequired.map((role) => role.trim().toLowerCase())
  );

  // Convert Set to Array for iteration
  const hasAccess = [...requiredRolesSet].some((requiredRole) =>
    userRolesSet.has(requiredRole)
  );

  console.log("Access granted:", hasAccess);


  if (!hasAccess) {
    console.warn("Access denied. Redirecting...");
    return <Navigate to="/unauthorized" replace />;
  }

    // if (!token && !isTokenValid(token)) {
    //   return <Navigate to="/login" replace />;
    // } 

  return <Outlet />;
};

// Route groups for roles
const PublicRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/verify-otp" element={<VerifyOTP />} />
  </Routes>
);

function App() {
  
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={<PublicRoutes />} />

          {/* User Routes */}
          <Route
            path="/customer/*"
            element={<ProtectedRoute rolesRequired={["customer"]} />}
          >
            <Route path="profile" element={<ProfileCustomer />} />
            <Route path="maintenance" element={<MaintenanceCustomer />} />
            <Route path="payments" element={<PaymentCustomer />} />
            <Route path="request-status" element={<ChatInterface id={""} />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="accounts" element={<Account />} />
            <Route path="receipts" element={<CustomerReceipts />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={<ProtectedRoute rolesRequired={["admin"]} />}
          >
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route path="chat" element={<AdminChatInterface />} />
            <Route path="tenants" element={<TenantManagement />} />
            <Route path="payment" element={<AdminPayment />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="tenancy-receipt" element={<TenancyReceipt />} />
          </Route>

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="dashboard" element={<AnalyticsDashboard />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
