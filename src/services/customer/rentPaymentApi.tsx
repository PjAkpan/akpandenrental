import axios from "axios";

const API_BASE_URL = "https://rental-management-backend.onrender.com/api";

export const uploadTenancyReceipt = async (userId: string, pictureProof: File) => {
  const formData = new FormData();
  formData.append("pictureProof", pictureProof);
  formData.append("userId", userId);

  const token = localStorage.getItem("authToken");
  const response = await axios.post(`${API_BASE_URL}/RentPayment/add/tenancy`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const fetchRentDetails = async (userId: string) => {
  const token = localStorage.getItem("authToken");
  const response = await axios.get(
    `${API_BASE_URL}/RentPayment/fetch/all?size=10&page=1&option=USERID&gSearch=${userId}&option=STATUS&gSearch=active`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const requestReceipt = async (requestId: string) => {
  const token = localStorage.getItem("authToken");
  const response = await axios.get(`${API_BASE_URL}/RentPayment/generate/receipt/${requestId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  });

  return response.data;
};
