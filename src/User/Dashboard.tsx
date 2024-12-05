import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLogOut } from 'react-icons/fi';
import SkeletonLoader from "../components/SkeletonLoader";

interface PaymentData {
  lastPayment: string;
  amountPaid: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [tenancyReceipt, setTenancyReceipt] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [roomData, setRoomData] = useState<{ roomNumber: string; dueDate: string } | null>(null);



  const handlePaymentReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentReceipt(e.target.files[0]);
    }
  };

  const handleTenancyReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTenancyReceipt(e.target.files[0]);
    }
  };

  // Function to upload payment receipt
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

  // Function to upload tenancy receipt
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
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Occupant Dashboard</h2>

         {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Room Details */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-blue-600 mb-4">Room Details</h3>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      ) : (
        <>
          <p className="text-gray-600">Room Number: {roomData?.roomNumber}</p>
          <p className="text-gray-600">Rent Due Date: {roomData?.dueDate}</p>
        </>
      )}
    </div>

          {/* Payment Status and Receipt Upload */}
          <div className="bg-green-50 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-green-600 mb-4">Payment Status</h3>
      {isLoading ? (
        <SkeletonLoader />
      ) : paymentData ? (
        <>
          <p className="text-gray-600">Last Payment: {paymentData.lastPayment}</p>
          <p className="text-gray-600">Amount Paid: ₦{paymentData.amountPaid.toLocaleString()}</p>
        </>
      ) : (
        <p className="text-red-600">Error loading payment data</p>
      )}

      {/* Upload Payment Receipt */}
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

          {/* Upload Tenancy Receipt */}
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

          {/* Maintenance Requests */}
          <div className="bg-red-50 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-red-600 mb-4">Maintenance Requests</h3>
            <p className="text-gray-600">Recent Request: Leaking Tap</p>
            <button
                onClick={() => navigate('/maintenance')}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Request Maintenance
              </button>
            </div>

                 {/* Payment Details */}
                 <div className="bg-purple-50 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-purple-600 mb-4">Payment Details</h3>
              <button
                onClick={() => setShowAccountDetails(true)}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                View Account Details
              </button>
            </div>

              {/* Payment Details Modal */}
          {showAccountDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Account Details</h2>
                <div className="mb-4">
                  <p className="text-gray-700 font-semibold">Bank Name: UBA Bank</p>
                  <p className="text-gray-700">Account Number: 2001018695</p>
                  <p className="text-gray-700">Account Holder: Akpan Johnson Akpan</p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">Bank Name: Union Bank</p>
                  <p className="text-gray-700">Account Number: 0032022628</p>
                  <p className="text-gray-700">Account Holder: Akpan Johnson Akpan</p>
                </div>
                <button
                  onClick={() => setShowAccountDetails(false)}
                  className="mt-6 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Back to Dashboard
                </button>
                </div>
            </div>
          )}
          </div>

          {/* Account Settings */}
          <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-purple-700 mb-3">Account Settings</h2>
            <button
              onClick={() => navigate('/profile')}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-full"
            >
              View Profile
            </button>
            <button
              onClick={() => navigate('/change-password')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Notifications</h3>
          <p className="text-gray-600">You have 2 new notifications.</p>
          <button
              onClick={() => navigate('/notifications')}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              View All Notifications
            </button>
          </div>

        {/* Display Message */}
        {message && (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
              <p className="text-gray-700">{message}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

