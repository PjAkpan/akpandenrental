/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../utils/Skeleton/Skeleton";
import { Payment, PaymentApiResponse } from "../types";

const formatAmount = (amount: string | number) => {
  const parsedAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return "Invalid Amount";
  }
  return parsedAmount.toLocaleString("en-US", {
    style: "currency",
    currency: "NGN",
  });
};

const AdminPayment: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);


  // Fetch payment data from the backend
  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<PaymentApiResponse>(
        "https://rental-management-backend.onrender.com/api/RentPayment/fetch/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log("Payments data:", response.data);
      console.log("API Response:", response.data);
      // Access payments from the response structure
      const paymentsData = response.data.payload?.data || [];
      // Set payments only if it's an array
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
    } catch (error: any) {
      console.error("Error fetching payment data:", error);
      setMessage(
        error.response?.data?.message || "Failed to load payment data."
      );
    } finally {
      setIsLoading(false);
    }
  };

    // Fetch specific payment receipt
    const fetchPaymentReceipt = async (paymentId: string) => {
      try {
        const response = await axios.get(
          `https://rental-management-backend.onrender.com/api/RentPayment/view/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const receipt = response.data.payload;
        alert(`Receipt Details:\n${JSON.stringify(receipt, null, 2)}`);
      } catch (error: any) {
        setMessage(error.response?.data?.message || "Failed to fetch payment receipt.");
      }
    };
  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPayments();
    }, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Function to generate and send the tenancy receipt
  const generateTenancyReceipt = async (tenantId: string, payment: string) => {
    navigate('/admin/tenancy-receipt', {
      state: { tenantId, payment },
    });
  };

  // Function to send receipt via email
  const sendReceiptViaEmail = async (tenantId: string, receiptUrl: string) => {
    try {
      await axios.post(
        `https://rental-management-backend.onrender.com/api/admin/send-receipt-email/${tenantId}`,
        { receiptUrl }
      );
      setMessage("Receipt sent via Email successfully!");
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Failed to send receipt via Email."
      );
    }
  };

  // Function to send receipt via WhatsApp
  const sendReceiptViaWhatsapp = async (
    tenantId: string,
    receiptUrl: string
  ) => {
    try {
      const phoneNumber = window.prompt(
        "Enter tenant's WhatsApp phone number:"
      );
      if (!phoneNumber || !/^[+]?\d+$/.test(phoneNumber)) {
        setMessage("Invalid phone number. Receipt not sent.");
        return;
      }
      await axios.post(
        `https://rental-management-backend.onrender.com/api/admin/send-receipt-whatsapp/${tenantId}`,
        { receiptUrl, phoneNumber }
      );
      setMessage("Receipt sent via WhatsApp successfully!");
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Failed to send receipt via WhatsApp."
      );
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = payments.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Fetch data on page load
  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Payments by Tenants
          </h2>

          {/* Payment List */}
          {isLoading ? (
            <SkeletonLoader />
          ) : payments.length > 0 ? (
            <div className="space-y-6">
              {currentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 bg-gray-50 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {payment.tenantName}
                  </h3>
                  <p className="text-gray-600">
                    Amount Paid:{" "}
                    {isNaN(Number(payment.paymentAmount)) ||
                    Number(payment.paymentAmount) <= 0
                      ? "Invalid amount"
                      : formatAmount(payment.paymentAmount)}
                  </p>

                  <p className="text-gray-600">
                    Payment Date:{" "}
                    {new Date(payment.paymentDate).toLocaleDateString("en-US")}
                  </p>

                  <button
                        onClick={() => fetchPaymentReceipt(payment.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                  >
                    View Payment Receipt
                    </button>

                  <br />
                  {/* <a
                    href={payment.tenancyReceipt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Tenancy Receipt
                  </a> */}
                  <div className="mt-4">
                    <button
                          onClick={() => generateTenancyReceipt(payment.id, payment.paymentAmount)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Generate Tenancy Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No payments found.</p>
          )}

          {/* Pagination */}
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from(
              { length: Math.ceil(payments.length / itemsPerPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>

          {/* Message */}
          {message && (
            <p className="text-center text-gray-700 mt-4">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayment;
