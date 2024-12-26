
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ApiResponse, ErrorResponse, Payment } from "../types";
import "./css/RentHistory.css";

const RentPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;

  const fetchPayments = async (pageNumber = 1) => {
    setLoading(true);
    setError("");

    console.log("Fetching payments...");

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found in local storage.");
      setLoading(false);
      return;
    }

    try {
      console.log(`Making API call for page: ${pageNumber}`);
      const response = await axios.get<ApiResponse>(
        `https://rental-management-backend.onrender.com/api/RentPayment/fetch/all?size=${String(size)}&page=${String(pageNumber)}&option=USERID&gSearch={{USERID}}`,
        {
          params: {
            option: ["USERID", "STATUS"],
            gSearch: [userId],
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      
      
      console.log("API Response:", response.data);
      const { data, currentPage, totalPages } = response.data.payload;
      setPayments(data);
      setPage(currentPage);
      setTotalPages(totalPages);
      console.log(`Payments fetched: ${data.length}`);
    } catch (err) {
      const errorMessage =
      (err as ErrorResponse)?.response?.data?.message ||
      "Failed to fetch payment history.";
    setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(page);
  }, [page]);

  return (
    <div className="payment-history">
      <h2>Payment History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
             <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => {
                const amount = Number(payment.paymentAmount);
                return (
                  <tr key={payment.id}>
                    <td>{index + 1 + size * (page - 1)}</td>
                    <td>₦{isNaN(amount) ? "Invalid amount" : amount.toLocaleString()}</td>
                    <td>{payment.status}</td>
                    <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RentPayments;
