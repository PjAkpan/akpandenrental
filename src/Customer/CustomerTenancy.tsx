import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";

const CustomerTenancy: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [pictureProof, setPictureProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [receiptRequest, setReceiptRequest] = useState<"email" | "whatsapp" | null>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);


  useEffect(() => {
    // Fetch userId from localStorage or API (if necessary)
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("User ID is missing. Please log in again.");
      navigate("/login");
    }
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setPictureProof(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !pictureProof) {
        setError("Please provide all required fields.");
        return;
      }

      const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!allowedFileTypes.includes(pictureProof.type)) {
        setError("Invalid file type. Only JPEG, JPG, PNG, and PDF are allowed.");
        return;
      }
  
      if (pictureProof.size > 5 * 1024 * 1024) {
        setError("File size exceeds the 5 MB limit.");
        return;
      }
    const formData = new FormData();
    formData.append("pictureProof", pictureProof);
    formData.append("userId", userId || "");

    setError(null);
    setSuccessMessage(null);

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://rental-management-backend.onrender.com/api/RentPayment/add/tenancy",formData,  {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, 
            },
          });

      if (response.status === 201) {
        setSuccessMessage("Tenancy payment added successfully!");
        setPictureProof(null);
      } else {
        throw new Error(response.data.message || "Failed to upload payment.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while uploading payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReceipt = async (method: "email" | "whatsapp") => {
    setReceiptLoading(true);
    setReceiptRequest(method);

    try {
      const response = await axios.post(
        "https://rental-management-backend.onrender.com/api/receipts/request",
        {
          userId,
          method,
        }
      );

      if (response.status === 200) {
        setSuccessMessage(
          `Receipt will be sent to your ${method === "email" ? "email" : "WhatsApp"} shortly.`
        );
      } else {
        throw new Error(response.data.message || "Failed to request receipt.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while requesting the receipt.");
    } finally {
      setReceiptLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft size={24} />
          <span className="ml-2 font-semibold">Back</span>
        </button>
        <h1 className="text-xl font-bold text-gray-800">Tenancy Receipt</h1>
        <button
          onClick={handleLogout}
          className="flex items-center text-red-600 hover:text-red-800"
        >
          <FiLogOut size={24} />
          <span className="ml-2 font-semibold">Logout</span>
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Upload your Tenancy Receipt</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {successMessage && (
              <p className="text-green-500 text-center">{successMessage}</p>
            )}
            <div>
              <label
                htmlFor="pictureProof"
                className="block text-sm font-medium text-gray-700"
              >
                Proof of Tenancy Receipt
              </label>
              <input
                type="file"
                id="pictureProof"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Submit"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold">Request Tenancy Receipt</h3>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => handleRequestReceipt("email")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                disabled={receiptLoading}
              >
                {receiptLoading && receiptRequest === "email"
                  ? "Requesting..."
                  : "Send to Email"}
              </button>
              <button
                onClick={() => handleRequestReceipt("whatsapp")}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                disabled={receiptLoading}
              >
                {receiptLoading && receiptRequest === "whatsapp"
                  ? "Requesting..."
                  : "Send to WhatsApp"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTenancy;
