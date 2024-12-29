import axios from "axios";

const API_BASE_URL = "https://rental-management-backend.onrender.com/api";

export const fetchUserProfile = async (storedUserId: any) => {
  const token = localStorage.getItem("authToken"); 
  if (!token) {
    throw new Error("Authorization token is missing. Please log in again.");
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/users/profile/${storedUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the header
      },
    });
  return response.data.payload;
} catch (error: any) {
  console.error("Error fetching user profile:", error.response?.data || error.message);
  throw new Error(error.response?.data?.message || "Failed to fetch profile data.");
}
};

export const addRentPayment = async (formData: any, token: any) => {
  const response = await axios.post(`${API_BASE_URL}/RentPayment/add`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


