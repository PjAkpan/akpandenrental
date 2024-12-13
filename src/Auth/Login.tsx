/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { loginUser } from "../services/auth";
import { LoginResponse } from "../types";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setUserRoles } = useUser();

  let deviceId = localStorage.getItem("deviceId");

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      if (!deviceId) {
        setModalMessage("Device ID is missing. Please sign up again.");
        setIsModalOpen(true);
        setIsLoading(false);
        return;
      }
      // Call the login API
      const loginResponse: LoginResponse = await loginUser(
        username,
        password,
        deviceId
      );
      // logger(loginResponse);

      // Log the entire response for debugging
      console.log("Login API response:", loginResponse);

      // Check if the response indicates a user not found scenario
      if (
        loginResponse?.code === 409 ||
        loginResponse.message === "User not found"
      ) {
        setModalMessage("User not found. Click here to sign up.");
        setIsModalOpen(true);
        return;
      }

      // Check for login failure
      if (!loginResponse || loginResponse.status === false) {
        throw new Error(
          loginResponse.message || "Login failed. Please try again."
        );
      }

      // Store the token in local storage
      localStorage.setItem("token", loginResponse.token);
      console.log(
        "Token stored in localStorage:",
        localStorage.getItem("token")
      );

      // Store the userId in localStorage
      if (loginResponse.payload?.UserId) {
        localStorage.setItem("userId", loginResponse.payload.UserId);
        console.log(
          "User ID stored in localStorage:",
          localStorage.getItem("userId")
        );
      }

      console.log("User ID from response:", loginResponse.payload?.userId);

      if (loginResponse.payload?.deviceId) {
        localStorage.setItem("deviceId", loginResponse.payload.deviceId);
        console.log(
          "Device ID stored in localStorage:",
          localStorage.getItem("deviceId")
        );
      }

      // Extract role and validate it
      const roles = loginResponse.payload?.access?.split(",") || []; // Assuming roles are comma-separated
      console.log("User roles:", roles);
      if (!roles.length) {
        throw new Error("No valid roles assigned to this user.");
      }

      // Debugging logs for successful login
      console.log(`User logged in as: ${roles}`);
      console.log("Full login response payload:", loginResponse.payload);

      // Set the first role (either 'customer' or 'admin') in context
      const userRole = roles[0]; // '0' for customer or '1' for admin
      setUserRoles(userRole); // Set the role, either '0' or '1'
      console.log("Role being set in context:", userRole);

      // Navigate based on the user role
      if (userRole === "0") {
        // If the role is '0' (customer), navigate to the customer dashboard
        navigate("/customer/maintenance");
      } else if (userRole === "1") {
        // If the role is '1' (admin), navigate to the admin dashboard
        navigate("/admin/tenants");
      } else {
        // For any other role, navigate to a default dashboard or throw an error
        navigate("/dashboard");
      }
    } catch (error) {
      setModalMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
      setIsModalOpen(true);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    const deviceId = localStorage.getItem("deviceId");

    if (!deviceId) {
      console.error("Device ID is missing.");
      setModalMessage("Failed to log out. Device ID is missing.");
      setIsLoading(false);
      return;
    }

    console.log("Attempting logout with:", { deviceId });

    try {
      const response = await axios.post(
        "https://rental-management-backend.onrender.com/api/users/logout",
        { deviceId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setLogoutSuccess(true);
        setModalMessage("You have successfully logged out from all devices.");
        localStorage.removeItem("token");
        setTimeout(() => {
          setIsModalOpen(false);
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // Handle case where user no longer exists in the backend
        console.warn("User no longer exists on the backend.");
        setModalMessage("User account not found. Please sign up again.");
        localStorage.clear(); // Clear stored data
        navigate("/signup"); // Redirect to the signup page
      } else if (err instanceof Error) {
        console.error("Error during logout:", err.message);
      } else {
        console.error("An unexpected error occurred:", err);
      }
      setModalMessage("Failed to log out from all devices. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeAction = (action: "signup" | "logout") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(false);
      if (action === "signup") {
        navigate("/signup");
      } else if (action === "logout") {
        handleLogout();
      }
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(username, password);
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
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-4 transition-all ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Log In"}
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

            {modalMessage === "User not found. Click here to sign up." ? (
              <button
                onClick={() => handleTakeAction("signup")}
                disabled={isLoading}
                className={`w-full bg-blue-500 text-white py-3 rounded-lg font-semibold transition-all ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                {isLoading ? "Redirecting..." : "Take Action"}
              </button>
            ) : (
              <button
                onClick={() => handleTakeAction("logout")}
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
