import React, { useEffect, useState } from "react";
import { FiSearch, FiPlus, FiEdit, FiTrash } from "react-icons/fi";
import axios from "axios";
import { Tenant } from "../types";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";

const TenantManagement: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [message, setMessage] = useState("");
  const [selectedTenants, setSelectedTenants] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    rentStatus: "",
    roomNumber: "",
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get(
          `https://rental-management-backend.onrender.com/api/users/${userId}/tenants`
        );
        setTenants(response.data);
      } catch (error) {
        setMessage("Error fetching tenant data.");
      }
    };
    fetchTenants();
  }, [userId]);

  useEffect(() => {
    // Fetch initial data (mocked for now)
    const fetchTenants = async () => {
      const data = [
        {
          id: 1,
          name: "John Doe",
          roomNumber: 101,
          contact: "08012345678",
          rentStatus: "Paid",
        },
        {
          id: 2,
          name: "Jane Smith",
          roomNumber: 102,
          contact: "08098765432",
          rentStatus: "Due",
        },
      ];
      setTenants(data);
    };

    fetchTenants();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSelectTenant = (id: number) => {
    setSelectedTenants((prev) =>
      prev.includes(id)
        ? prev.filter((tenantId) => tenantId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedTenants((prev) =>
      prev.length === tenants.length ? [] : tenants.map((tenant) => tenant.id)
    );
  };

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!filters.rentStatus || tenant.rentStatus === filters.rentStatus) &&
      (!filters.roomNumber ||
        tenant.roomNumber.toString() === filters.roomNumber)
  );

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Room Number,Contact,Rent Status"].join(",") +
      "\n" +
      tenants
        .map((t) => [t.name, t.roomNumber, t.contact, t.rentStatus].join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, "tenants.csv");
  };

  const handleSendReminders = () => {
    const tenantsWithUnpaidRent = tenants.filter(
      (tenant) => tenant.rentStatus === "Due"
    );
    alert(
      `Reminders sent to tenants: ${tenantsWithUnpaidRent
        .map((t) => t.name)
        .join(", ")}`
    );
  };

  const handleBulkDelete = () => {
    if (window.confirm("Are you sure you want to delete selected tenants?")) {
      setTenants((prev) =>
        prev.filter((tenant) => !selectedTenants.includes(tenant.id))
      );
      setSelectedTenants([]);
    }
  };

  const handleAddTenant = () => {
    setSelectedTenant(null);
    setIsModalOpen(true);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  const handleDeleteTenant = (id: number) => {
    if (window.confirm("Are you sure you want to delete this tenant?")) {
      setTenants((prev) => prev.filter((tenant) => tenant.id !== id));
    }
  };

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  const handleSaveTenant = async (tenant: Tenant) => {
    if (tenant.id) {
      // Edit existing tenant
      setTenants((prev) =>
        prev.map((t) => (t.id === tenant.id ? { ...t, ...tenant } : t))
      );
      setMessage("Tenant updated successfully!");
    } else {
      // Add new tenant
          setTenants((prev) => 
            prev.map((t) => (t.id === tenant.id ? { ...t, ...tenant } : t))
        );
          setMessage("Tenant successfully added!");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tenant Management</h1>

      {/* Display message */}
      {message && <div className="mb-4 text-green-600">{message}</div>}

      {/* Navigation back to Dashboard */}
      <button
        className="bg-gray-600 text-white px-4 py-2 rounded-lg mb-4"
        onClick={handleReturnToDashboard}
      >
        Return to Dashboard
      </button>

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
            <option value="">All Status</option>
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
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={handleExport}
        >
          Export Data
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={handleAddTenant}
        >
          <FiPlus className="mr-2" /> Add Tenant
        </button>
      </div>

      {/* Tenants Table */}
      <table className="w-full bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">
              <input
                type="checkbox"
                checked={selectedTenants.length === tenants.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Room Number</th>
            <th className="px-4 py-2">Contact</th>
            <th className="px-4 py-2">Rent Status</th>
            <th className="px-4 py-2">Lease Expiry</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTenants.map((tenant) => (
            <tr key={tenant.id} className="border-t">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedTenants.includes(tenant.id)}
                  onChange={() => toggleSelectTenant(tenant.id)}
                />
              </td>
              <td className="px-4 py-2">{tenant.name}</td>
              <td className="px-4 py-2">{tenant.roomNumber}</td>
              <td className="px-4 py-2">{tenant.contact}</td>
              <td
                className={`px-4 py-2 ${
                  tenant.rentStatus === "Paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {tenant.rentStatus}
              </td>
              <td className="px-4 py-2">
                {tenant.leaseExpiryDate && (
                  <span
                    className={`${
                      new Date(tenant.leaseExpiryDate).getTime() - Date.now() <=
                      30 * 24 * 60 * 60 * 1000
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {new Date(tenant.leaseExpiryDate).toLocaleDateString()}
                  </span>
                )}
              </td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleEditTenant(tenant)}
                >
                  <FiEdit />
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDeleteTenant(tenant.id)}
                >
                  <FiTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bulk Actions */}
      <div className="mt-4 flex space-x-2">
        <button
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
          onClick={handleBulkDelete}
          disabled={selectedTenants.length === 0}
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
          tenant={selectedTenant}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTenant}
        />
      )}
    </div>
  );
};

type TenantModalProps = {
  tenant: Tenant | null;
  onClose: () => void;
  onSave: (tenant: Tenant) => void;
};

const TenantModal: React.FC<TenantModalProps> = ({
  tenant,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Tenant>(
    tenant || { id: 0, name: "", roomNumber: 0, contact: "", rentStatus: "Due" }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">
          {tenant ? "Edit Tenant" : "Add Tenant"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Room Number</label>
            <input
              type="number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Rent Status</label>

            <select
              name="rentStatus"
              value={formData.rentStatus}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="Paid">Paid</option>
              <option value="Due">Due</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantManagement;
