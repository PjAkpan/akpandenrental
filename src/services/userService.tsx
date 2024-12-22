import axios from "axios";

const BASE_URL = "https://rental-management-backend.onrender.com/api/users";

export const fetchUserProfile = async (userId: any) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.get(`${BASE_URL}/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    throw new Error("Failed to fetch profile data.");
  }
};

export const updateUserOccupation = async (userId: any, occupation: any) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.put(
      `${BASE_URL}/update`,
      { userId, occupation },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Payload sent to API:", { userId, occupation });

    return response;
  } catch (error) {
    throw new Error("Failed to update occupation.");
  }
};
