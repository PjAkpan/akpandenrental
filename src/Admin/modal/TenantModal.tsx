
import React, { useState, useEffect } from "react";

interface TenantModalProps {
  selectedUserProfile: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

const TenantModal: React.FC<TenantModalProps> = ({
  selectedUserProfile,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    roomNumber: "",
    contact: "",
    rentStatus: "Paid",
  });

  useEffect(() => {
    if (selectedUserProfile) {
      setFormData({
        name: selectedUserProfile.name,
        roomNumber: selectedUserProfile.roomNumber,
        contact: selectedUserProfile.contact,
        rentStatus: selectedUserProfile.rentStatus,
      });
    }
  }, [selectedUserProfile]);

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
          {selectedUserProfile ? "Edit Tenant" : "Add Tenant"}
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

export default TenantModal;
