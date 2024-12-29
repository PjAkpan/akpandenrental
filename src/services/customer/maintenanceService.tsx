
import { createFetcher } from '../../utils';


const BASE_URL = "https://rental-management-backend.onrender.com/api";

export const submitMaintenanceRequest = async (formData: FormData, token: string) => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("User ID is required.");
    }

    formData.append("userId", userId);

      const postMaintenanceRequest = createFetcher({
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        method: "post",
        url: `${BASE_URL}/maintenance/add`,
        data: formData as any,
        timeout: 60 * 9 * 1000, // 9 minutes
      });
      const response = await postMaintenanceRequest.trigger();
      return response.payload;
  } catch (error) {
    console.error("Error submitting maintenance request:", error);
    throw error;
  }
};
