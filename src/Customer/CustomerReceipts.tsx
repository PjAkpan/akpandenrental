/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";
import SkeletonLoader from "../utils/Skeleton/Skeleton";
import { PaymentData } from "../types";

const CustomerReceipts: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRoomNumber, setUserRoomNumber] = useState<string>("N/A");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [pictureProof, setPictureProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>(""); 
  const [nextRentDueDate, setNextRentDueDate] = useState<string>(""); 

  // Fetch user and room details
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      console.error("User ID not found in localStorage");
      navigate("/login");
      return;
    }

    setUserId(storedUserId);

    axios
      .get(
        `https://rental-management-backend.onrender.com/api/users/profile/${storedUserId}`
      )
      .then((response) => {
        const data = response.data.payload;
        if (data) {
          setUserRoomNumber(data.roomNumber || "N/A");
        } else {
          console.error("No payload found in API response");
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error.message);
      });
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setPictureProof(file);
  };

  const saveRentPaymentDetails = (paymentDetails: {
    amount: string;
    status: string;
    nextRentDueDate: string;
  }) => {
    localStorage.setItem("rentPaymentDetails", JSON.stringify(paymentDetails));
    console.log("Rent Payment Details saved to localStorage:", paymentDetails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentDate || !paymentAmount || !pictureProof) {
      setError("Please fill in all fields and upload a proof of payment.");
      return;
    }

    if (!userRoomNumber || userRoomNumber === "N/A") {
      setError("Room number is missing. Please contact support.");
      return;
    }

    if (!userId) {
      setError("User ID is required. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("paymentDate", paymentDate);
    formData.append("paymentAmount", paymentAmount);
    formData.append("pictureProof", pictureProof);
    formData.append("roomNumber", userRoomNumber);
    formData.append("userId", userId);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://rental-management-backend.onrender.com/api/RentPayment/add",
        formData
      );

      if (response.status === 201 && response.data.code === 201) {
        const rentPaymentDetails = {
          amount: paymentAmount,
          status: "Paid",
          nextRentDueDate: response.data.payload?.nextRentDueDate || "12/22/2025", 
        };
        saveRentPaymentDetails(rentPaymentDetails); 
        setSuccessMessage("Rent payment added successfully!");
        setError(null);
        setPaymentDate("");
        setPaymentAmount("");
        setPictureProof(null);

        // Save the rent payment ID to localStorage with key 'id'
        const rentPaymentId = response.data.payload?.id;
        if (rentPaymentId) {
          console.log("Storing rent payment ID:", rentPaymentId);
          localStorage.setItem("id", rentPaymentId); // Store ID in localStorage
        }

        setTimeout(() => {
          setShowModal(true);
        }, 3000);
      } else {
        throw new Error(response.data.message || "Unexpected response status");
      }
    } catch (err: any) {
      setError(err.message || "Failed to add rent payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  const handleContinueToDashboard = () => {
    setShowModal(false);
    navigate("/customer/dashboard");
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
        <h1 className="text-xl font-bold text-gray-800">Upload Receipts</h1>
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
          <h2 className="text-2xl font-bold mb-4 text-center">Rent Payment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {successMessage && (
              <p className="text-green-500 text-center">{successMessage}</p>
            )}

            <div>
              <label
                htmlFor="paymentDate"
                className="block text-sm font-medium text-gray-700"
              >
                Payment Date
              </label>
              <input
                type="date"
                id="paymentDate"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label
                htmlFor="paymentAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Payment Amount
              </label>
              <input
                type="number"
                id="paymentAmount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter payment amount"
                required
              />
            </div>

            <div>
              <label
                htmlFor="pictureProof"
                className="block text-sm font-medium text-gray-700"
              >
                Proof of Payment (JPEG, JPG, PNG, PDF)
              </label>
              <input
                type="file"
                id="pictureProof"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                accept=".jpg, .jpeg, .png, .pdf"
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className={`bg-orange-500 text-white px-6 py-2 rounded-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
                }`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-md">
            <h2 className="text-xl font-semibold text-center mb-4">
              Thank You for Uploading Your Receipt
            </h2>
            <p className="text-center mb-6">
              Your payment will be confirmed, and a tenancy receipt will be sent to you. If there are any issues with your payment, you will be contacted.
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleContinueToDashboard}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Continue to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReceipts;
