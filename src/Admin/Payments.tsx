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
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
      const paymentsData = response.data.payload?.data || [];
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
    } catch (error: any) {
      console.error("Error fetching payment data:", error);
      setMessage(
        error.response?.data?.message || "Failed to load payment data. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
      setMessage(
        error.response?.data?.message || "Failed to fetch payment receipt. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = payments.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Payments by Tenants
          </h2>
          {isLoading ? (
            <SkeletonLoader />
          ) : payments.length > 0 ? (
            <div>
              <table
                className="min-w-full bg-white border border-gray-200 rounded-lg"
                aria-label="Tenant Payments Table"
              >
                <thead>
                  <tr className="bg-gray-200 text-gray-800">
                  <th className="px-4 py-2 text-left">Room Number</th>
                    <th className="px-4 py-2 text-left">Amount Paid</th>
                    <th className="px-4 py-2 text-left">Payment Date</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPayments.map((payment) => (
                    <tr key={payment.id} className="border-t">
                     <td className="px-4 py-2">{payment.roomNumber}</td>
                      <td className="px-4 py-2">
                        {formatAmount(payment.paymentAmount)}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(payment.paymentDate).toLocaleDateString("en-US")}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => fetchPaymentReceipt(payment.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600"
                        >
                          View Receipt
                        </button>
                        <button
                          onClick={() =>
                            navigate("/admin/tenancy-receipt", {
                              state: {
                                tenantId: payment.id,
                                payment: payment.paymentAmount,
                              },
                            })
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Generate Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No payments found.</p>
          )}
          {message && (
            <div className="mt-4 text-center text-red-500">
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayment;
