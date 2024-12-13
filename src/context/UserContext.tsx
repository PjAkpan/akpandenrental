import React, { createContext, useContext, useState } from "react";
import { UserContextType } from "../types";



const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<string[] | null>(() => {
    const storedRoles = localStorage.getItem("roles");
    console.log("Stored Roles on Load:", storedRoles); // Debugging roles
    return storedRoles ? JSON.parse(storedRoles) : null;
  });

  const setUserRoles = (rolesString: string) => {
    const parsedRoles = rolesString.split(","); // Split the roles string into an array
    console.log("Setting Roles:", parsedRoles); // Debugging roles
    setRoles(parsedRoles);
    localStorage.setItem("roles", JSON.stringify(parsedRoles)); // Store roles in localStorage
  };

  return (
    <UserContext.Provider value={{ roles, setUserRoles }}>
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
