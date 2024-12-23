import React, { useState, useEffect } from "react";
import axios from "axios";
import { RentPayment } from "../types";

const RentPayments = () => {
  const [filters, setFilters] = useState({
    gSearch: "",
    option: "USERID", // Default option
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
  const [error, setError] = useState("");

  const fetchData = async () => {
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

    try {
        const response = await axios.get(endpoint, { params });
        const { data: fetchedData, totalPages: fetchedTotalPages } = response.data.payload;
        setData(fetchedData);
        setTotalPages(fetchedTotalPages);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [filters]);

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

  return (
    <div className="rent-payments">
            <form className="filter-form" onSubmit={applyFilters}>
        <input
          type="text"
          name="gSearch"
          value={filters.gSearch}
          placeholder="Search"
          onChange={handleFilterChange}
        />
        <select name="option" value={filters.option} onChange={handleFilterChange}>
          <option value="STATUS">Status</option>
          <option value="ISACTIVE">Is Active</option>
        </select>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <button onClick={fetchData}>Apply Filters</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Is Active</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record) => (
                <tr key={record.id}>
                  <td>{record.userId}</td>
                  <td>{record.status}</td>
                  <td>{record.isActive ? "Yes" : "No"}</td>
                  <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
};

export default RentPayments;
