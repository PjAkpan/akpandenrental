/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Filters, RentPayment } from "../types";

const RentPayments = () => {
    const [filters, setFilters] = useState<Filters>({
    gSearch: "userId",
    option: "USERID", 
    orderBy: "createdAt",
    sort: "DESC",
    size: 10,
    page: 1,
    startDate: "",
    endDate: "",
  });
  const [data, setData] = useState<RentPayment[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [modalData, setModalData] = useState<RentPayment | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    const baseUrl = "https://rental-management-backend.onrender.com/api";
    const endpoint = `${baseUrl}/RentPayment/fetch/all`;
    const params = {
      size: filters.size,
      page: filters.page,
      option: filters.option,
      gSearch: filters.gSearch, // Dynamic UserID search
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      orderBy: filters.orderBy,
      sort: filters.sort,
    };

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setError("Unauthorized: No token available. Please log in again.");
      setLoading(false);
      return;
    }
    try {
        const response = await axios.get(endpoint, {
          params,
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        });
        const { data: fetchedData, totalPages: fetchedTotalPages } =
          response.data.payload;
        setData(fetchedData);
        setTotalPages(fetchedTotalPages);
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch data");
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }, [filters]);
  
    useEffect(() => {
        fetchData();
    }, [fetchData]); 

    // try {
    //     const response = await axios.get(endpoint, { params });
    //     const { data: fetchedData, totalPages: fetchedTotalPages } = response.data.payload;
    //     setData(fetchedData);
    //     setTotalPages(fetchedTotalPages);
    //   } catch (err: any) {
    //     setError(err.response?.data?.message || "Failed to fetch data");
    //   } finally {
    //     setLoading(false);
    //   }
    // };

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

  const handleFilterChange = (e: { target: { name: any; value: any; }; }) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePagination = (page: number) => {
    setFilters({ ...filters, page });
  };
  

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

    // Open modal with detailed rent payment data
    const openModal = (payment: RentPayment) => {
        setModalData(payment);
      };
    
      // Close modal and redirect to dashboard
      const closeModal = () => {
        setModalData(null);
        window.location.href = "/customer/dashboard"; // Redirect to the dashboard
      };
    

      return (
        <div className="rent-payments">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div>
              {/* Filter Inputs */}
              <div className="filters">
                <label htmlFor="startDate">Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
                <label htmlFor="endDate">End Date:</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
                <label htmlFor="gSearch">Search by User ID:</label>
                <input
                  type="text"
                  name="gSearch"
                  value={filters.gSearch}
                  onChange={handleFilterChange}
                />
              </div>
    
              {/* Rent Payment History Table */}
              <table>
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((record) => (
                    <tr key={record.id}>
                      <td>{record.amount}</td>
                      <td>{record.status}</td>
                      <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => openModal(record)}>View More</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
    
              {/* Pagination */}
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={filters.page === index + 1 ? "active" : ""}
                    onClick={() => handlePagination(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
    
          {/* Modal for viewing more details */}
          {modalData && (
            <div className="modal">
              <div className="modal-content">
                <h2>Payment Details</h2>
                <p><strong>Amount:</strong> {modalData.amount}</p>
                <p><strong>Status:</strong> {modalData.status}</p>
                <p><strong>Date:</strong> {new Date(modalData.createdAt).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {modalData.description}</p>
                <button onClick={closeModal}>Close</button>
              </div>
            </div>
          )}
        </div>
      );
    };
    
    export default RentPayments;