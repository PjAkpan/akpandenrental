/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import axios from "axios";
import { signUp } from "../services/index"; 
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setUsername] = useState("");
  const [fullName, setUserFullname] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

 

  const handleSignup = async (e?: { preventDefault: () => void }) => {
    if (e) {
      e.preventDefault();
    }
    const deviceId = localStorage.getItem("deviceId");
    try {
      const userData = { email, fullName, password, password2, roomNumber, phoneNumber, deviceId };
      const data = await signUp(userData); // Call the signUp function from auth.js
  
      const { referenceId, deviceId: responseDeviceId } = data.payload;
  
      if (referenceId) {
        localStorage.setItem("referenceId", referenceId);
        navigate("/verify-otp", { state: { email, referenceId } });
      }
      if (responseDeviceId) {
        localStorage.setItem("deviceId", responseDeviceId);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error during signup:", err.message);
      } else {
        console.error("Unknown error during signup");
      }
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      {/* Signup Form */}
      <div className="flex-grow flex justify-center items-center p-6">
        <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Hostel Management Signup
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Create an account to manage your rental space.
          </p>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="text-lg text-gray-700 font-semibold">Full name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setUserFullname(e.target.value)}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-lg text-gray-700 font-semibold">Username (Email)</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-lg text-gray-700 font-semibold">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="text-lg text-gray-700 font-semibold">Confirm Password</label>
              <input
                type="password"
                placeholder="Enter your password again"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="text-lg text-gray-700 font-semibold">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-lg text-gray-700 font-semibold">Room Number</label>
              <select
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Room Number</option>
                {Array.from({ length: 27 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Room {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              By signing up, you agree to our{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Privacy Policy
              </a>.
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-full shadow-md focus:outline-none"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-500 font-semibold hover:underline"
              >
                Click here to login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;