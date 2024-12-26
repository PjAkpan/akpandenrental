/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { FiSearch, FiPlus, FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { UserProfile } from "../types";
import TenantModal from "./modal/TenantModal";

const TenantManagement: React.FC = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState("");
  const [selectedUserProfiles, setSelectedUserProfiles] = useState<number[]>([]);
  const [filters, setFilters] = useState({ rentStatus: "", roomNumber: "" });
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  const [sortOptions, setSortOptions] = useState({
    orderBy: "createdAt",
    sort: "DESC",
  });

  const navigate = useNavigate();

  const fetchUserProfiles = async (page: number, size: number, orderBy: string = 'createdAt', sort: string = 'DESC') => {
    try {
      const response = await axios.get(`https://rental-management-backend.onrender.com/api/users/fetch/all?size=2&page=1&option=&gSearch=`
    
      );
      console.log(response);
      console.log(response.data);

      if (response.data?.payload?.data) {
        setUserProfiles(response.data.payload.data);
        setPagination({
          page,
          size,
          totalRecords: response.data.payload.totalRecords,
          totalPages: response.data.payload.totalPages,
        });
      } else {
        console.log("No data found in response.payload.data");
      }
    } catch (error) {
      setMessage("Error fetching tenant data.");
    }
  };

  useEffect(() => {
    fetchUserProfiles(pagination.page, pagination.size, sortOptions.orderBy, sortOptions.sort);
  }, [pagination.page, pagination.size, sortOptions]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (orderBy: string) => {
    setSortOptions((prev) => ({
      orderBy,
      sort: prev.sort === "ASC" ? "DESC" : "ASC",
    }));
  };

  const toggleSelectUserProfile = (id: number) => {
    setSelectedUserProfiles((prev) =>
      prev.includes(id) ? prev.filter((profileId) => profileId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedUserProfiles((prev) =>
      prev.length === userProfiles.length ? [] : userProfiles.map((profile) => profile.id)
    );
  };

  const filteredUserProfiles = userProfiles.filter(
    (userProfile) =>
      userProfile.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!filters.rentStatus || userProfile.rentStatus === filters.rentStatus) &&
      (!filters.roomNumber || userProfile.roomNumber.toString() === filters.roomNumber)
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Full Name,Room Number,Contact,Status,Next Rent Due Date,Amount Paid"].join(",") +
      "\n" +
      userProfiles
        .map((profile) =>
          [profile.fullName, profile.roomNumber, profile.phoneNumber, profile.rentStatus, profile.nextRentDueDate, profile.AmountPaid].join(",")
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, "userProfiles.csv");
  };

  const handleSendReminders = () => {
    const profilesWithUnpaidRent = userProfiles.filter((profile) => profile.rentStatus === "Due");
    alert(`Reminders sent to users: ${profilesWithUnpaidRent.map((p) => p.fullName).join(", ")}`);
  };

  const handleBulkDelete = () => {
    if (window.confirm("Are you sure you want to delete selected profiles?")) {
      setUserProfiles((prev) => prev.filter((userProfile) => !selectedUserProfiles.includes(userProfile.id)));
      setSelectedUserProfiles([]);
    }
  };

  const handleAddUserProfile = () => {
    setSelectedUserProfile(null);
    setIsModalOpen(true);
  };
  const handleEditUserProfile = (userProfile: UserProfile) => {
    setSelectedUserProfile(userProfile);
    setIsModalOpen(true);
  };
  const handlePaginationChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchUserProfiles(newPage, pagination.size);
  };

  const handleDeleteUserProfile = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await axios.delete(`https://rental-management-backend.onrender.com/api/users/delete/${id}`);
        setUserProfiles((prev) => prev.filter((profile) => profile.id !== id));
        setMessage("Profile deleted successfully.");
      } catch (error) {
        setMessage("Error deleting profile.");
      }
    }
  };

  const handleSaveUserProfile = async (userProfile: UserProfile) => {
    try {
      if (userProfile.id) {
        await axios.put(`https://rental-management-backend.onrender.com/api/users/update/${userProfile.id}`, userProfile);
        setUserProfiles((prev) => prev.map((profile) => (profile.id === userProfile.id ? { ...profile, ...userProfile } : profile)));
        setMessage("Profile updated successfully!");
      } else {
        const response = await axios.post("https://rental-management-backend.onrender.com/api/users/add", userProfile);
        setUserProfiles((prev) => [...prev, response.data.payload.data]);
        setMessage("Profile successfully added!");
      }
      setIsModalOpen(false);
    } catch (error) {
      setMessage("Error saving profile.");
    }
  };

  const handleBackToDashboard = () => {
     navigate("/admin/dashboard");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tenant Management</h1>

      <button
onClick={handleBackToDashboard}
className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
>
Back to Dashboard
</button>

      {/* Display message */}
      {message && <div className="mb-4 text-green-600">{message}</div>}

      {/* Search and Add Tenant */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search tenants..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex space-x-2">
          <select
           name="rentStatus"
            className="border rounded-lg px-3 py-2"
            value={filters.rentStatus}
            onChange={handleFilterChange}
          >
            <option value="">All Rent Status</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
          </select>
          <input
            type="number"
            name="roomNumber"
            placeholder="Room Number"
            className="border rounded-lg px-3 py-2"
            value={filters.roomNumber}
            onChange={handleFilterChange}
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={handleExport}>Export Data</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center" onClick={handleAddUserProfile}>
          <FiPlus className="mr-2" /> Add Tenant
        </button>
      </div>

      {/* Table with Sorting */}
      <div className="overflow-x-auto">
  <table className="min-w-full bg-white border">
    <thead>
      <tr>
        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 uppercase">Full Name</th>
        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 uppercase">Email</th>
        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 uppercase">Room Number</th>
        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 uppercase">Phone Number</th>
        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 uppercase">Status</th>
        <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 uppercase">Actions</th>
      </tr>
    </thead>
    <tbody>
      {userProfiles.map((profile) => (
        <tr key={profile.id} className="bg-gray-100 hover:bg-gray-200">
          <td className="px-6 py-4 border-b border-gray-300">{profile.userInfo.fullName}</td>
          <td className="px-6 py-4 border-b border-gray-300">{profile.email}</td>
          <td className="px-6 py-4 border-b border-gray-300">{profile.userInfo.roomNumber}</td>
          <td className="px-6 py-4 border-b border-gray-300">{profile.userInfo.phoneNumber}</td>
          <td className="px-6 py-4 border-b border-gray-300">
            {profile.isActive ? (
              <span className="text-green-600 font-bold">Active</span>
            ) : (
              <span className="text-red-600 font-bold">Inactive</span>
            )}
          </td>
          <td className="px-6 py-4 border-b border-gray-300">
            <div className="flex space-x-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => handleEditUserProfile(profile)}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDeleteUserProfile(profile.id)}
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm">
          Page {pagination.page} of {pagination.totalPages}
        </div>
        <div className="space-x-2">
        <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => handlePaginationChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Prev
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => handlePaginationChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="mt-4 flex space-x-2">
        <button
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={handleBulkDelete}
          disabled={selectedUserProfiles.length === 0}
        >
          Delete Selected
        </button>
        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg"
          onClick={handleSendReminders}
        >
          Send Reminders
        </button>
      </div>

      {/* Tenant Modal */}
      {isModalOpen && (
        <TenantModal
          selectedUserProfile={selectedUserProfile}
          onSave={handleSaveUserProfile}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TenantManagement;
