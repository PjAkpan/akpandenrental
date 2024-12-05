/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { loginUser } from "../services/auth";
import { logger } from "netwrap";

interface DecodedToken {
  role: string;
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserRoles } = useUser();

  const deviceId = localStorage.getItem("deviceId") || "unknown-device";

const handleLogin = async (
  username: string,
  password: string,
  deviceId: string
) => {
  try {
    // Call the login API
    const loginResponse = await loginUser(username, password, deviceId);
   // logger(loginResponse);

    // Check for login failure
    if (!loginResponse || loginResponse.status === false) {
      throw new Error(
        loginResponse.message || "Login failed. Please try again."
      );
    }

    // Store the token in local storage
    localStorage.setItem("token", loginResponse.token);

    // Extract role and validate it
    const role = loginResponse.payload?.access;
    if (!role || typeof role !== "string") {
      throw new Error("Invalid user role received from server.");
    }

    // Set user role in context
   setUserRoles(role);
  console.log("Role being set:", role);
 

  // Navigate to the dashboard page
  navigate("/dashboard");

  
  } catch (error) {
    setModalMessage(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred. Please try again."
    );
    setIsModalOpen(true);
  }
};
  // const handleLogin = async (username: string, password: string, deviceId: string) => {
  //   try {
  //     // Use the imported loginUser function
  //     const loginResponse = await loginUser(username, password, deviceId);
  //     logger(loginResponse);
  //       if(loginResponse.status ===false){
  //       throw new Error(loginResponse.message);

  //     }

  //     // Store the token in local storage
  //    localStorage.setItem("token", loginResponse.token);
  // const role = loginResponse.payload.access;
  //     // // Ensure role is a valid string and set the user role
  //     if (typeof role === "string") {
  //       setUserRole(role); // Store user role in context
  
  //       // Navigate based on the user role
  //       if (role.includes("admin")) {
  //         navigate("/dashboard");
  //       } else if (role.includes("customer")) {
  //         navigate("/dashboard");
  //       } else {
  //         navigate("/"); // Default redirection
  //       }
  //     } else {
  //       throw new Error("Invalid user role received");
  //     }
  //   } catch (error) {
  //     setModalMessage(
  //       error instanceof Error
  //         ? error.message
  //         : "An unexpected error occurred. Please try again."
  //     );
  //     setIsModalOpen(true);
  //   }
  // };
  


  const handleLogout = async () => {
    setIsLoading(true);

    // Retrieve userId from localStorage
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID is missing");
      setModalMessage("Failed to log out. User ID is missing.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://rental-management-backend.onrender.com/api/users/logout",
        { userId, deviceId }, // Include userId and deviceId in the payload
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setLogoutSuccess(true);
        setModalMessage("You have successfully logged out from all devices.");
        localStorage.removeItem("userId");
        setTimeout(() => {
          setIsModalOpen(false);
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error during logout:", err.message);
      } else {
        console.error("An unexpected error occurred:", err);
      }
      setModalMessage("Failed to log out from all devices. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(username, password, deviceId); // Pass the required arguments here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Log in to access your account and manage your room.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          className="space-y-6"
        >
          <div>
            <label className="text-lg text-gray-700 font-semibold">
              Username (Email)
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-lg text-gray-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-4 transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Log In
          </button>
        </form>

        <div className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 hover:text-blue-700 cursor-pointer font-semibold"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Attention</h3>
            <p className="text-gray-600 mb-6">{modalMessage}</p>
            {logoutSuccess ? (
              <p className="text-green-600 font-semibold">
                Redirecting to login...
              </p>
            ) : (
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className={`w-full bg-red-500 text-white py-3 rounded-lg font-semibold transition-all ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-600"
                }`}
              >
                {isLoading ? "Logging Out..." : "Log Out from All Devices"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
