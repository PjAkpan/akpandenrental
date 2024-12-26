/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiHome } from "react-icons/fi";
import { submitMaintenanceRequest } from '../services/maintenanceService';
import Modal from './modal/MaintenanceModal';


const MaintenanceCustomer = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [pictureProof, setPictureProof] = useState<File | null>(null);  // Allow File or null
  const [videoProof, setVideoProof] = useState<File | null>(null);  // Allow File or null
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");
  const [showModal, setShowModal] = useState(false); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  // Handle file input changes
  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => setPictureProof(e.target.files?.[0] || null);
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => setVideoProof(e.target.files?.[0] || null);

  // Function to submit maintenance request
  const submitRequest = async () => {
    if (!subject || !description) {
      setMessage("Please fill out the subject and description.");
      return;
    }
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("description", description);
    
    if (pictureProof) formData.append("pictureProof", pictureProof);
    if (videoProof) formData.append("videoProof", videoProof);

      // Retrieve token from localStorage
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    setMessage("You must be logged in to submit a maintenance request.");
    navigate("/login");  
    return;
  }
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "multipart/form-data",  
  };

    setLoading(true);
    try {
      await submitMaintenanceRequest(formData, token); 
      // setMessage("Maintenance request submitted successfully!");
           // Start countdown before opening modal
           let countdownTimer = 3;
           const timer = setInterval(() => {
             if (countdownTimer > 0) {
               setCountdown(countdownTimer);
               countdownTimer--;
             } else {
               clearInterval(timer);
               setShowModal(true); // Show modal after countdown
             }
           }, 1000); // 1 second interval
    } catch {
      setMessage("Failed to submit maintenance request.");
    } finally {
      setLoading(false);
    }
  };

  // Function to view request status
  const viewRequestStatus = () => navigate('/customer/request-status'); 

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">

      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6 mt-4">
        {/* Subject Input */}
        <label className="block text-gray-700 font-semibold mb-2">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Brief subject of your request"
        />

        {/* Description Input */}
        <label className="block text-gray-700 font-semibold mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Describe the maintenance issue"
        />

        {/* Picture Proof Input */}
        <label className="block text-gray-700 font-semibold mb-2">Picture Proof (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePictureChange}
          className="w-full mb-4"
        />

        {/* Video Proof Input */}
        <label className="block text-gray-700 font-semibold mb-2">Video Proof (optional)</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="w-full mb-4"
        />

        {/* Submit Button */}
        <button
          onClick={submitRequest}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>

        {/* Message Display */}
        {message && (
          <div className="mt-4 p-2 bg-gray-100 text-center text-gray-700">
            {message}
          </div>
        )}

        {/* View Request Status */}
        <div className="mt-6">
          <button
            onClick={viewRequestStatus}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            View Request Status
          </button>
          {requestStatus && (
            <p className="mt-4 text-center text-gray-700">
              Current Status: <span className="font-semibold">{requestStatus}</span>
            </p>
          )}
        </div>
      </div>
      {/* Modal Popup */}
      {showModal && (
        <Modal 
          message={`Your maintenance request has been submitted successfully!`}
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default MaintenanceCustomer;
