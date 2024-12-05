/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext"; // Import UserProvider and custom hook

import Home from "./pages/Home";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import Logout from "./Auth/Logout";
import ForgotPassword from "./Auth/ForgotPassword";
import VerifyOTP from "./Auth/Verify-otp";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment/payment";
import Maintenance from "./pages/Maintenance/maintenance";
import { RequestStatus } from "./pages/Maintenance";
import AnalyticsDashboard from "./pages/Dashboard";



// Role-based route guards
interface ProtectedRouteProps {
  rolesRequired: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ rolesRequired }) => {
  const { roles, setUserRoles} = useUser(); // Use userRole from the context
   // Set user role in context
  //  const rolesss ="customer, guest, admin"
  //  setUserRoles(rolesss);
  // Debugging: Log roles and rolesRequired
  console.log("User roles:", roles);
  console.log("Required roles for this route:", rolesRequired);

  if (!roles) {
    // Loading state when roles are not fetched yet
    return <div>Loading...</div>;
  }
  
  const userRolesSet = new Set(roles.map(role => role.trim().toLowerCase()));
  const requiredRolesSet = new Set(rolesRequired.map(role => role.trim().toLowerCase()));

  // Convert Set to Array for iteration
  const hasAccess = Array.from(requiredRolesSet).some(requiredRole =>
    userRolesSet.has(requiredRole)
  );
  console.log("Access granted:", hasAccess);

  if (!hasAccess) {
    // Redirect unauthorized users
    console.warn("Access denied. Redirecting...");
   return <Navigate to="/login" replace />;
  }

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
        <Route path="/user/*" element={<ProtectedRoute rolesRequired={["customer"]} />}>
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/*" element={<ProtectedRoute rolesRequired={["user"]} />}>
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="request-status" element={<RequestStatus />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="dashboard" element={<AnalyticsDashboard />} />
      </Routes>
    </Router>
  </UserProvider>
  );
}

export default App;
