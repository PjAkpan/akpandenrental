/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { MaintenanceRequest } from "../types";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";


const socket = io("https://rental-management-backend.onrender.com");


const MaintenancePage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([
    { id: 1, tenantName: "John Doe", issue: "Leaking faucet", status: "Pending", createdAt: "2024-12-09" },
    { id: 2, tenantName: "Jane Smith", issue: "Broken window", status: "In Progress", createdAt: "2024-12-08" },
  ]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState(""); 
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  const updateStatus = (id: number, status: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard"); 
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
            <th className="border border-gray-300 p-2">Tenant Name</th>
            <th className="border border-gray-300 p-2">Issue</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td className="border border-gray-300 p-2">{req.tenantName}</td>
              <td className="border border-gray-300 p-2">{req.issue}</td>
              <td className="border border-gray-300 p-2">{req.status}</td>
              <td className="border border-gray-300 p-2">{req.createdAt}</td>
              <td className="border border-gray-300 p-2">
                <select
                  value={req.status}
                  onChange={(e) => updateStatus(req.id, e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
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
