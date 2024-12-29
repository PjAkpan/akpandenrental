import axios from "axios";

const BASE_URL = "https://rental-management-backend.onrender.com/api";

export const getUserProfile = async (userId: any) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const fetchRentDetail = async (userId: any, token: any) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/RentPayment/fetch/all?size=10&page=1&option=USERID&gSearch=${userId}&option=STATUS&gSearch=active`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching rent details:", error);
    throw error;
  }
};
