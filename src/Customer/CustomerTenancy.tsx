/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RentPaymentResponse } from "../types";
import { uploadTenancyReceipt, fetchRentDetails, requestReceipt } from "../services/customer/index";

const CustomerTenancy: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [pictureProof, setPictureProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null); 
  const [rentDetails, setRentDetails] = useState<RentPaymentResponse | null>(null);
  const [rentLoading, setRentLoading] = useState(true);
  const [rentError, setRentError] = useState<string | null>(null);

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
    setLoading(true);

    try {
      await uploadTenancyReceipt(userId, pictureProof);
      setSuccessMessage("Tenancy payment added successfully!");
      setPictureProof(null);
    } catch (err: any) {
      setError(err.message || "An error occurred while uploading payment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getRentDetails = async () => {
      if (!userId) return;
      setRentLoading(true);

      try {
        const data = await fetchRentDetails(userId);
        if (data?.payload?.data?.length > 0) {
          setRentDetails(data.payload.data[0]);
          setRequestId(data.payload.data[0].id);
        } else {
          setRentError("No active rent payment found.");
        }
      } catch (err: any) {
        setRentError(err.message || "An error occurred while fetching rent details.");
      } finally {
        setRentLoading(false);
      }
    };

    getRentDetails();
  }, [userId]);

  const handleRequestReceipt = async () => {
    if (!requestId) {
      setError("Invalid request ID. Please try again.");
      return;
    }

    setReceiptLoading(true);
    try {
      const receiptData = await requestReceipt(requestId);
      const url = window.URL.createObjectURL(new Blob([receiptData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Rent_Receipt_${requestId}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      setSuccessMessage("Your Tenancy Receipt is ready for download.");
    } catch (err: any) {
      setError(err.message || "An error occurred while requesting the receipt.");
    } finally {
      setReceiptLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Upload your Tenancy Receipt
          </h2>
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
            <h3 className="text-lg font-semibold">Generate Tenancy Receipt</h3>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => handleRequestReceipt()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                disabled={receiptLoading}
              >
                {receiptLoading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTenancy;
