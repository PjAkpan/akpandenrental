
import React, { useEffect, useState } from "react";
import {  Payment, RentPaymentsResponse } from "../types";
import { fetchRentPayments } from "../services/customer/index";
import "./css/RentHistory.css";
import { useQuery } from "@tanstack/react-query";




const RentPayments = () => {
  const size = 5; // Page size
  const [page, setPage] = React.useState(1);

  // React Query fetch function
  const fetchPayments = async (pageNumber: number) => {
    const userId = localStorage.getItem("userId");
    const authToken = localStorage.getItem("authToken");
    if (!userId || !authToken) {
      throw new Error("User ID or Auth Token not found in local storage.");
    }
    const response = await fetchRentPayments(userId, authToken, size, pageNumber);
    return response; // Assumes response contains { data, currentPage, totalPages }
  };




const { data, isLoading, isError, error } = useQuery<
  RentPaymentsResponse,
  Error
>({
  queryKey: ["rentPayments", page],
  queryFn: () => fetchPayments(page),
  keepPreviousData: true, // Smooth pagination
  retry: false, // No retry on error
});

const payments = data?.data || [];
const totalPages = data?.totalPages || 0;

  return (
    <div className="payment-history">
      <h2>Payment History</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="error">{(error as Error).message}</p>
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
              {payments.map((payment: Payment, index: number) => {
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

// const RentPayments = () => {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const size = 10;

//   const fetchPayments = async (pageNumber = 1) => {
//     setLoading(true);
//     setError("");

//     console.log("Fetching payments...");

//     const userId = localStorage.getItem("userId");
//     const authToken = localStorage.getItem("authToken");
//     if (!userId || !authToken) {
//       setError("User ID or Auth Token not found in local storage.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const { data, currentPage, totalPages } = await fetchRentPayments(
//         userId,
//         authToken,
//         size,
//         pageNumber
//       );
//       setPayments(data);
//       setPage(currentPage);
//       setTotalPages(totalPages);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };
      

//   useEffect(() => {
//     fetchPayments(page);
//   }, [page]);

//   return (
//     <div className="payment-history">
//       <h2>Payment History</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="error">{error}</p>
//       ) : (
//         <>
//              <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {payments.map((payment, index) => {
//                 const amount = Number(payment.paymentAmount);
//                 return (
//                   <tr key={payment.id}>
//                     <td>{index + 1 + size * (page - 1)}</td>
//                     <td>₦{isNaN(amount) ? "Invalid amount" : amount.toLocaleString()}</td>
//                     <td>{payment.status}</td>
//                     <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//           <div className="pagination">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((prev) => prev - 1)}
//             >
//               Previous
//             </button>
//             <span>
//               Page {page} of {totalPages}
//             </span>
//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage((prev) => prev + 1)}
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

//export default RentPayments;
