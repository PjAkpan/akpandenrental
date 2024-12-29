import axios from "axios";


const BASE_URL = "https://rental-management-backend.onrender.com/api";

export const  fetchSingleMaintenanceRequest  = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/maintenance/view/${id}`);
    return response.data.payload; 
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    throw error;
  }
};
