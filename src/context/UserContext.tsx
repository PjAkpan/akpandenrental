import React, { createContext, useContext, useState } from "react";
import { UserContextType } from "../types";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<string[] | null>(() => {
    const storedRoles = localStorage.getItem("roles");
    console.log("Stored Roles on Load:", storedRoles); // Debugging roles
    return storedRoles ? JSON.parse(storedRoles) : [];
  });

  const setUserRoles = (rolesInput: string | string[]) => {
    let parsedRoles: string[];
    if (typeof rolesInput === "string") {
      parsedRoles = rolesInput.split(",");
    } else {
      parsedRoles = rolesInput || [];
    }
    const updatedRoles = Array.from(new Set([...(roles || []), ...parsedRoles]));
    console.log("Setting Roles:", parsedRoles); // Debugging roles
    setRoles(updatedRoles);
    localStorage.setItem("roles", JSON.stringify(updatedRoles));  // Store roles in localStorage
  };

  const isAdmin = roles?.includes("admin");
  const isCustomer = roles?.includes("customer");

  console.log("Role Check - Admin:", isAdmin, "Customer:", isCustomer); // Debugging role checks

  return (
    <UserContext.Provider value={{ roles, setUserRoles, isAdmin, isCustomer }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
