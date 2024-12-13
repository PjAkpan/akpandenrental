// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useUser } from "../context/UserContext";


// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ rolesRequired }) => {
//   const { roles} = useUser();
//   console.log("User roles:", roles);
//   console.log("Required roles for this route:", rolesRequired);

//   if (!roles) {
   
//     return <div>Loading...</div>;
//   }
//   const userRolesSet = new Set(roles.map((role: string) => role.trim().toLowerCase()));
//   const requiredRolesSet = new Set(rolesRequired.map((role: string) => role.trim().toLowerCase()));

//   // Convert Set to Array for iteration
//   const hasAccess = [...requiredRolesSet].some(requiredRole =>
//     userRolesSet.has(requiredRole));

//     console.log("Access granted:", hasAccess);

//     if (!hasAccess) {
//       // Redirect unauthorized users
//       console.warn("Access denied. Redirecting...");
//      return <Navigate to="/login" replace />;
//     }
  
//     return <Outlet />;
//   };

// export default ProtectedRoute;




  





