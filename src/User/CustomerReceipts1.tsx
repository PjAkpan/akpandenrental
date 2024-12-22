/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLogOut } from 'react-icons/fi';
import SkeletonLoader from "../utils/Skeleton/Skeleton";
import { PaymentData } from "../types";


const CustomerReceipts: React.FC = () => {
  const navigate = useNavigate();
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [tenancyReceipt, setTenancyReceipt] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [accountDetails, setAccountDetails] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [roomData, setRoomData] = useState<{ roomNumber: string; dueDate: string } | null>(null);

  // Function to handle payment receipt file change
  const handlePaymentReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentReceipt(e.target.files[0]);
    }
  };

  // Function to handle tenancy receipt file change
  const handleTenancyReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTenancyReceipt(e.target.files[0]);
    }
  };

  // Function to upload the payment receipt
  const uploadReceipt = async () => {
    if (!paymentReceipt) {
      setMessage("Please select a payment receipt to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("receipt", paymentReceipt);

    try {
      await axios.post('/api/upload-payment-receipt', formData);
      setMessage("Payment receipt uploaded successfully!");
    } catch (error) {
      setMessage("Failed to upload payment receipt.");
    }
  };

  // Function to upload the tenancy receipt
  const uploadTenancyReceipt = async () => {
    if (!tenancyReceipt) {
      setMessage("Please select a tenancy receipt to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("receipt", tenancyReceipt);

    try {
      await axios.post('/api/upload-tenancy-receipt', formData);
      setMessage("Tenancy receipt uploaded successfully!");
    } catch (error) {
      setMessage("Failed to upload tenancy receipt.");
    }
  };

  useEffect(() => {
    // Simulating fetching room data
    const fetchRoomData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setRoomData({
          roomNumber: "12",
          dueDate: "5th of every month",
        });
        setIsLoading(false);
      }, 2000);
    };

    fetchRoomData();
  }, []);

  useEffect(() => {
    // Fetch payment data from API
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<PaymentData>("/api/payment-data");
        setPaymentData(response.data);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await fetch("/api/account-details");
        if (response.ok) {
          const data = await response.json();
          setAccountDetails(data.data); 
        } else {
          console.error("Failed to fetch account details");
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    };

    if (showAccountDetails) {
      fetchAccountDetails();
    }
  }, [showAccountDetails]); 

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
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
        <h1 className="text-xl font-bold text-gray-800">Payment</h1>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Receipts</h2>

          {/* Payment Status */}

          <div className="bg-green-50 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-green-600 mb-4">Upload new/old payment & tenancy receipt here</h3>
            {/* {isLoading ? (
              <SkeletonLoader />
            ) : paymentData ? (
              <>
                <p className="text-gray-600">Last Payment: {paymentData.lastPayment}</p>
                <p className="text-gray-600">Amount Paid: ₦{paymentData.amountPaid.toLocaleString()}</p>
              </>
            ) : (
              <p className="text-red-600">Error loading payment data</p>
            )} */}
            <input
              type="file"
              accept="image/*"
              onChange={handlePaymentReceiptChange}
              className="mt-4"
            />
            <button
              onClick={uploadReceipt}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Upload Receipt
            </button>
          </div>

          {/* Tenancy Receipt */}
          <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-yellow-600 mb-4">Tenancy Receipt</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleTenancyReceiptChange}
              className="mt-4"
            />
            <button
              onClick={uploadTenancyReceipt}
              className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Upload Receipt
            </button>
          </div>





          {/* Message */}
          {message && <p className="text-center text-gray-700 mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default CustomerReceipts;
