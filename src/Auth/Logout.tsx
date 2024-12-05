import { useNavigate } from "react-router-dom";
import React from "react";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage/sessionStorage tokens or any authentication state
    localStorage.removeItem("authToken");
    localStorage.removeItem("deviceId");
    sessionStorage.clear();

    // Redirect to login page
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      Logout
    </button>
  );
};

export default Logout;
