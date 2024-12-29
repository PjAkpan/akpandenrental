import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faUser, faEnvelope, faPhone, faDoorOpen, faCog } from "@fortawesome/free-solid-svg-icons";
import { fetchUserProfile, updateUserOccupation } from "../services/customer/userService"; 

const ProfileCustomer = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<boolean>(false);
  const [isEditingOccupation, setIsEditingOccupation] = useState<boolean>(false);
  const [occupation, setOccupation] = useState<string>("");
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetchUserProfile(userId); // Call the service function

        if (response.status === 200) {
          setUserProfile(response.data.payload);
          setOccupation(response.data.payload.occupation || "");
          setStatus(response.data.status);
        } else {
          setError(response.data.message || "Failed to fetch profile data.");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  const handleSaveOccupation = async () => {
    try {
      const response = await updateUserOccupation(userId, occupation); 

      if (response.status === 200) {
        setUserProfile({ ...userProfile, occupation });
        setIsEditingOccupation(false);
      } else {
        alert(response.data.message || "Failed to update occupation.");
      }
    } catch (error) {
      console.error("Error updating occupation:", error);
      alert("An error occurred while saving your changes.");
    }
  };

  const toggleSettings = () => setShowSettings(!showSettings);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">No profile data found.</p>
      </div>
    );
  }

  const statusBadge = status === true ? (
    <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-green-100 text-green-600">
      Active
    </span>
  ) : (
    <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-red-100 text-red-600">
      Inactive
    </span>
  );
  

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
            {/* Navbar */}
            <div className="absolute top-4 right-4">
        <FontAwesomeIcon
          icon={faCog}
          className="text-gray-600 text-2xl cursor-pointer hover:text-gray-800"
          onClick={toggleSettings}
        />
                {showSettings && (
          <div className="absolute top-10 right-0 bg-white shadow-md rounded-lg p-4 w-64">
            <h2 className="text-lg font-medium mb-4">Account Settings</h2>
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mb-2 hover:bg-blue-600"
              onClick={() => window.open("mailto:johnso.peacead@gmail.com")}
            >
              Contact Admin via Email
            </button>
            <button
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              onClick={() => window.open("https://wa.me/8034104663")}
            >
              Contact Admin via WhatsApp
            </button>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {/* Profile Picture Placeholder */}
              <FontAwesomeIcon icon={faUser} className="text-gray-600 text-5xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            {userProfile.fullName || "Customer"}
          </h1>
          <p className="text-gray-500">{userProfile.email}</p>
          <div className="mt-2">{statusBadge}</div>
        </header>

        {/* User Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info */}
          <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              User Information
            </h2>
            <p className="flex items-center">
              <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-2" />
              <strong>Full Name:</strong>&nbsp;{userProfile.fullName || "Not provided"}
            </p>
            <p className="flex items-center mt-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-2" />
              <strong>Email:</strong>&nbsp;{userProfile.email || "Not provided"}
            </p>
            <p className="flex items-center mt-2">
              <FontAwesomeIcon icon={faPhone} className="text-gray-500 mr-2" />
              <strong>Phone Number:</strong>&nbsp;{userProfile.phoneNumber || "Not provided"}
            </p>
            <p className="flex items-center mt-2">
              <FontAwesomeIcon icon={faDoorOpen} className="text-gray-500 mr-2" />
              <strong>Room Number:</strong>&nbsp;{userProfile.roomNumber || "Not provided"}
            </p>
          </div>

          {/* Account Details */}
          <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Account Details
            </h2>

            <p className="mt-2">
              <strong>Home Address:</strong>&nbsp;
              {userProfile.homeAddress || "Ikot Akpaden road, beside the university"}
            </p>

            <div className="mt-2">
              <p>
              <strong>Occupation:</strong>
              {isEditingOccupation ? (
                <div>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="border rounded p-2 w-full mt-2"
                  />
                  <button
                    onClick={handleSaveOccupation}
                    className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <span
                  className="ml-2 cursor-pointer text-blue-500 hover:underline"
                  onClick={() => setIsEditingOccupation(true)}
                >
                  {occupation || "Click to add occupation"}
                </span>
              )}
              </p>
            </div>

            <p className="mt-2">
              <strong>Last Login:</strong>&nbsp;
              {new Date().toLocaleDateString()}
            </p>
            <p className="mt-2">
              <strong>Account Created:</strong>&nbsp;
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <button
            className="bg-gray-800 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-900 transition-all"
            onClick={() => navigate("/customer/dashboard")}
          >
            Back to Dashboard
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ProfileCustomer;