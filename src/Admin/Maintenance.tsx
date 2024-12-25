/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { MaintenanceRequest } from "../types";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("https://rental-management-backend.onrender.com");


const MaintenancePage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState(""); 
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const baseURL = "https://rental-management-backend.onrender.com/api";
  const fetchMaintenanceURL = `${baseURL}/maintenance/fetch/all?size=10&page=1&option=&gSearch=`;


  // Fetch maintenance requests
  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        const response = await fetch(fetchMaintenanceURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch maintenance requests:", response.status);
          return;
        }

        const data = await response.json();
        console.log("Fetched maintenance requests:", data);

        // Update requests state with API data
        setRequests(data.payload.data || []);
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
      }
    };

    fetchMaintenanceRequests();
  }, [fetchMaintenanceURL]);

  // Handle WebSocket connection and receiving messages
  useEffect(() => {
    socket.on("message", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]); 
    });

    return () => {
      socket.off("message"); // Clean up WebSocket listener on component unmount
    };
  }, []);

  // Scroll to the bottom of the chat when a new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleStatusChange = async (MaintenanceId: number, status: string ) => {
    try {
      const payload = {
        status,
        MaintenanceId,
      };
      const response = await fetch(`${baseURL}/maintenance/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Failed to update status:", response.status);
        return;
      }

      const updatedMaintenance = await response.json();
      console.log("Status updated successfully:", updatedMaintenance);

    setRequests((prev) =>
      prev.map((req) =>
        req.id === MaintenanceId
          ? { ...req, status: updatedMaintenance.payload.isActive }
          : req
      )
    );
  } catch (error) {
    console.error("Error updating status:", error);
  }
};


  const updateStatus = (id: number, status: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  const handleBackToDashboard = () => {
    navigate("/admin/dashboard"); 
  };

  const handleChatIconClick = () => {
    navigate("/admin/chat");
  };


  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("sendMessage", newMessage); // Send the message to the WebSocket server
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add message to local state
      setNewMessage(""); // Clear the input field
    }
  };

  return (
    <div className="relative p-6">
      <h1 className="text-2xl font-bold mb-4">Maintenance Requests</h1>

      {/* Back to Dashboard Button */}
      <button
        onClick={handleBackToDashboard}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        Back to Dashboard
      </button>

      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Tenant ID</th>
            <th className="border border-gray-300 p-2">Subject</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">CreatedAt</th>
            <th className="border border-gray-300 p-2">Actions</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Files</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td className="border border-gray-300 p-2">{req.userId}</td>
              <td className="border border-gray-300 p-2">{req.subject}</td>
              <td className="border border-gray-300 p-2">{req.description}</td>
              <td className="border border-gray-300 p-2">{req.createdAt}</td>
              <td className="border border-gray-300 p-2">
                <select
                  value={req.status}
                  onChange={(e) => handleStatusChange(req.id, e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>
              <td className="border border-gray-300 p-2">
                {req.isActive ? "Active" : "Closed"}
              </td>
              <td className="border border-gray-300 p-2">
                {new Date(req.createdAt).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 p-2">
                {req.files.length > 0 ? (
                  req.files.map((file, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      {file.pictureProof && (
                        <a
                          href={file.pictureProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Picture
                        </a>
                      )}
                      {file.videoProof && (
                        <a
                          href={file.videoProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Video
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  "No files"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Floating Chat Icon */}
      <div
        className="fixed bottom-10 right-10 bg-blue-600 text-white p-4 rounded-full cursor-pointer shadow-lg"
        onClick={handleChatIconClick}
      >
        <span className="text-xl">💬</span>
      </div>

      {/* Chat Component - Toggleable */}
      {isChatOpen && (
        <div className="fixed bottom-16 right-10 bg-white p-4 w-80 h-96 rounded-lg shadow-lg border">
          <h3 className="font-semibold text-lg">Chat with Tenants</h3>
          <div className="overflow-y-auto h-full">
            {/* Chat Messages */}
            <div className="p-2 space-y-2">
              {messages.map((message, index) => (
                <div key={index} className="text-sm">
                  <p>{message}</p>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* To scroll to the latest message */}
            </div>
          </div>

          {/* Message Input */}
          <div className="flex mt-2">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-600 text-white p-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;
