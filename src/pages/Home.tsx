// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

let deviceId = localStorage.getItem("deviceId");
if (!deviceId) {
  deviceId = crypto.randomUUID(); 
  localStorage.setItem("deviceId", deviceId);
}

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-r from-gray-100 to-gray-300 px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-tight">
          Welcome to Ikot Akpaden Hostel Management
        </h1>
        <p className="text-gray-700 mt-4 text-sm sm:text-base lg:text-lg">
  Experience seamless hostel management in Ikot Akpaden, where convenience, comfort, and reliability come together to redefine modern living.
</p>


      </div>

      {/* Button Section */}
      <div className="w-full max-w-sm">
        <button
          onClick={() => navigate("/login")}
          className="w-full px-6 py-3 bg-indigo-500 text-white text-lg font-medium rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Home;
