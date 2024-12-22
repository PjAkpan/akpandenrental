/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { loginUser } from "../services/auth";
import { LoginResponse } from "../types";
import { getGeneralDeviceId } from "../utils";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setUserRoles } = useUser();

     



  const handleLogin = async (username: string, password: string, paymentId: string ) => {
    setIsLoading(true);
      let deviceId = localStorage.getItem("deviceId") || await getGeneralDeviceId();
    try {
      if (!deviceId) {
        setModalMessage("Device ID is missing. Please sign up again.");
        setIsModalOpen(true);
        setIsLoading(false);
        return;
      }
      console.log("Initial LocalStorage Contents:", localStorage);
      console.log("Stored Payment ID:", paymentId);
      // Call the login API
      const loginResponse: LoginResponse = await loginUser(username, password, deviceId, paymentId);
    setIsLoading(false);
       console.log("Login API response:", loginResponse);
      // Check if the response indicates a user not found scenario
      if ( loginResponse?.code === 409 || loginResponse.message === "User not found") {
        setModalMessage("User not found. Click here to sign up.");
        setIsModalOpen(true);
        return;
      }

      // Check for login failure
      if (!loginResponse || loginResponse.status === false) {
        throw new Error( loginResponse.message || "Login failed. Please try again.");
      }

      // Store the token in local storage
      localStorage.setItem("token", loginResponse.token);
      console.log("Token stored in localStorage:", localStorage.getItem("token"));

      // Store the userId in localStorage
      if (loginResponse.payload?.UserId) {
        localStorage.setItem("userId", loginResponse.payload.UserId);
        console.log( "User ID stored in localStorage:",localStorage.getItem("userId"));}

      if (loginResponse.payload?.deviceId) {
        localStorage.setItem("deviceId", loginResponse.payload.deviceId);
        console.log("Device ID stored in localStorage:", localStorage.getItem("deviceId"));}

   if (loginResponse.payload?.rentPaymentId) {
      console.log("Storing rent payment ID:", loginResponse.payload.rentPaymentId);
      localStorage.setItem("id", loginResponse.payload.rentPaymentId);  // Store the rent payment ID
        }

        console.log("Updated LocalStorage Contents after login:", localStorage);

      // Extract role and validate it
      const roles = loginResponse.payload?.access?.split(",") || []; // Assuming roles are comma-separated
      console.log("User roles:", roles);
     
      if (!roles.length) {
        throw new Error("No valid roles assigned to this user.");
      }
      setUserRoles(roles[0]);

      localStorage.setItem("roles", JSON.stringify(roles)); 

      const userRole = roles[0];
      console.log("User role is:", userRole);
      if (userRole === "customer") {
        console.log("Redirecting to /customer/dashboard");
        navigate("/customer/dashboard");
      } else if (userRole === "admin") {
        console.log("Redirecting to /admin/tenants");
        navigate("/admin/tenants");
      } else {
        console.log("Redirecting to /dashboard");
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error,"error here come")
       setIsLoading(false);
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
    const userId = localStorage.getItem("userId");

    console.log("Device ID during logout:", deviceId);
    console.log("User ID during logout:", userId);
    console.log("LocalStorage Contents before logout:", localStorage);

    if (!deviceId || !userId) {
      console.error("Device ID is missing.");
      setModalMessage("Failed to log out. Device ID is missing.");
      setIsLoading(false);
      return;
    }

    console.log("Attempting logout with:", { deviceId, userId });

    try {
      const response = await axios.post(
        "https://rental-management-backend.onrender.com/api/users/logout",
        { userId }, 
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setLogoutSuccess(true);
        setModalMessage("You have successfully logged out from all devices.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId"); 
        console.log("Token and User ID removed from LocalStorage.");
        console.log("LocalStorage Contents after logout:", localStorage);
        setTimeout(() => {
          setIsModalOpen(false);
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        console.warn("User no longer exists on the backend.");
        setModalMessage("User account not found. Please sign up again.");
        navigate("/signup"); 
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

  const handleTakeAction = async (action: "signup" | "logout") => {
  setIsLoading(true);

  if (action === "signup") {
    setIsLoading(false);
    setIsModalOpen(false);
    navigate("/signup");
  } else if (action === "logout") {
    try {
      await handleLogout(); // Assuming this is an async function
       setIsLoading(false);
    } catch (error) {
      console.error("Logout failed:", error);
       setIsLoading(false);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  }
};

  // const handleTakeAction = (action: "signup" | "logout") => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     setIsModalOpen(false);
  //     if (action === "signup") {
  //       navigate("/signup");
  //     } else if (action === "logout") {
  //       handleLogout();
  //     }
  //   }, 2000);
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(username, password, paymentId || "");
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
            ) : modalMessage === "You are being logged out due to inactivity." ? (
        <button
          onClick={() => handleTakeAction("logout")}
          disabled={isLoading}
          className={`w-full bg-red-500 text-white py-3 rounded-lg font-semibold transition-all ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
          }`}
        >
          {isLoading ? "Logging Out..." : "Log Out from All Devices"}
        </button>
      )  : modalMessage === "You are already logged in on another device. Please log out from that device first." ?  (
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
            ):(
        <button
          onClick={() => {
            setIsModalOpen(false); // Close modal for default case
          }}
          className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold transition-all hover:bg-gray-600"
        >
          Close
        </button>
      )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
