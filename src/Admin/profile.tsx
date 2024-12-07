import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineHome } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";

// Define the Profile interface
interface Profile {
  profileImage: string;
  fullName: string;
  role: string;
  email: string;
  phoneNumber: string;
}

const ProfilePage = () => {
  // Type the state for profile, loading, and error
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch profile data from the backend
  const fetchProfileData = async () => {
    try {
      const response = await axios.get("https://rental-management-backend.onrender.com/api/profile"); // Replace with your backend endpoint
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to load profile data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className={`bg-white shadow-md p-4 flex justify-between items-center`}>
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 lg:hidden">
            <FiMenu size={28} />
          </button>
          <AiOutlineHome size={28} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        </div>
      </nav>

      {/* Profile Details */}
      <div className="flex flex-col items-center mt-10">
        <div className="w-3/4 md:w-1/2 lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <img
              src={profile?.profileImage || "https://via.placeholder.com/100"}
              alt="Profile"
              className="rounded-full w-24 h-24 object-cover"
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{profile?.fullName}</h2>
            <p className="text-gray-600">{profile?.role}</p>
            <p className="text-gray-600">{profile?.email}</p>
            <p className="text-gray-600">{profile?.phoneNumber}</p>
            {profile?.role === "admin" && (
              <div className="mt-4">
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
            {profile?.role === "customer" && (
              <div className="mt-4">
                <button
                  onClick={() => navigate("/customer/orders")}
                  className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700"
                >
                  View Orders
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
