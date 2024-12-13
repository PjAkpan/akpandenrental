import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser, faEnvelope, faPhone, faDoorOpen } from "@fortawesome/free-solid-svg-icons";

const ProfileCustomer = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showProfileId, setShowProfileId] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://rental-management-backend.onrender.com/api/users/profile/${userId}`
        );

        if (response.status === 200) {
          setUserProfile(response.data.payload);
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

    fetchUserProfile();
  }, [userId, navigate]);

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
            {userProfile.fullName || "Admin"}
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
            <p className="flex items-center">
              <strong>Profile ID:</strong>
              <span className="ml-2">
                {showProfileId ? userProfile.profileId : "###############"}
              </span>
              <FontAwesomeIcon
                icon={showProfileId ? faEyeSlash : faEye}
                className="ml-2 text-gray-600 cursor-pointer hover:text-gray-800"
                onClick={() => setShowProfileId(!showProfileId)}
              />
            </p>
            <p className="mt-2">
              <strong>Home Address:</strong>&nbsp;
              {userProfile.homeAddress || "Not provided"}
            </p>
            <p className="mt-2">
              <strong>Occupation:</strong>&nbsp;
              {userProfile.occupation || "Not provided"}
            </p>
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
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ProfileCustomer;
