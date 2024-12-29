import axios from "axios";
import { ApiResponse, ErrorResponse } from "../../types";

const API_BASE_URL = "https://rental-management-backend.onrender.com/api";

export const fetchRentPayments = async (
  userId: string,
  authToken: string,
  size: number,
  pageNumber: number
) => {
  try {
    const response = await axios.get<ApiResponse>(
      `${API_BASE_URL}/RentPayment/fetch/all?size=${String(size)}&page=${String(pageNumber)}&option=USERID&gSearch={{USERID}}`,
      {
        params: {
          option: ["USERID", "STATUS"],
          gSearch: [userId],
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data.payload;
  } catch (err) {
    const errorMessage =
      (err as ErrorResponse)?.response?.data?.message ||
      "Failed to fetch payment history.";
    throw new Error(errorMessage);
  }
};
