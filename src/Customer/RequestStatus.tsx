/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, ChangeEvent } from "react";
import io from "socket.io-client";
import {
  FiPaperclip, FiSend, FiEdit, FiTrash, FiSun, FiMoon,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Message } from "../types";
import {  fetchSingleMaintenanceRequest } from "../services/chatService"; // Importing the service

const socket = io("https://rental-management-backend.onrender.com", {
  transports: ["websocket"], // Ensures a stable connection
  reconnection: true,
});


const ChatInterface: React.FC<{ id: string }> = ({ id }) => {
  console.log("Received id:", id); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [typedMessage, setTypedMessage] = useState<string>(""); 
  const [attachedFile, setAttachedFile] = useState<File | null>(null); 
  const [isEditing, setIsEditing] = useState<number | null>(null); 
  const [notification, setNotification] = useState<string>(""); 
  const [isTyping, setIsTyping] = useState<boolean>(false); 
  const [selectedChat, setSelectedChat] = useState<string | null>(null); 
  const [selectedChatDetails, setSelectedChatDetails] = useState<any | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false); 
  const navigate = useNavigate();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleChatClick = async (id: string) => {
    try {
      const chatDetails = await fetchSingleMaintenanceRequest(id);
      setSelectedChatDetails(chatDetails); 
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };
  const handleSendMessage = () => {
    if (!typedMessage && !attachedFile) {
      alert("Please type a message or attach a file.");
      return;
    }

    if (isEditing !== null) {
      // Edit existing message
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === isEditing
            ? { ...msg, content: typedMessage, edited: true }
            : msg
        )
      );
      setNotification("Message was edited");
      setIsEditing(null);
    } else {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "Client",
        content: attachedFile ? attachedFile.name : typedMessage,
        timestamp: new Date().toLocaleTimeString(),
        type: attachedFile ? "file" : "text",
      };

      setMessages((prevMessages) => {
        return [...prevMessages, newMessage];
      });
    }
    setTypedMessage("");
    setAttachedFile(null);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  useEffect(() => {
    if (id) {
    const fetchRequestDetails = async (id: string) => {
      try {
        const requestDetails = await fetchSingleMaintenanceRequest(id);
        setSelectedChatDetails(requestDetails); 
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
      }
    };
  
    fetchRequestDetails(id);
  }

    socket.on("adminTyping", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));

    return () => {
      socket.off("adminTyping");
      socket.off("stopTyping");
    };
 
  }, [id]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedMessage(e.target.value);
    if (e.target.value) socket.emit("userTyping");
    else socket.emit("stopTyping");
  };

  const handleEditMessage = (id: number, content: string) => {
    setIsEditing(id);
    setTypedMessage(content);
  };

  const handleDeleteMessage = (id: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, isDeleted: true } : msg
      )
    );
    setNotification("Message was deleted successfully.");
  };

  return (
    <div
      className={`h-screen flex ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      {/* Sidebar */}
      <div
        className={`w-1/4 ${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"} p-4 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold mb-4">Chats</h3>
          <button
            onClick={toggleDarkMode}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>


              {selectedChatDetails ? (
          <div>
            <p>{selectedChatDetails.title}</p>
            <p>{selectedChatDetails.description}</p>
            </div>
              ) : (
          <p>Loading chat details...</p>
        )}

        <button
          onClick={() => navigate("/admin/maintenance")}
          className={`w-full mt-4 ${darkMode ? "bg-blue-700 hover:bg-blue-600" : "bg-blue-500 hover:bg-blue-600"} text-white py-2 rounded-lg`}
        >
          New Maintenance Request
        </button>
    </div>

      {/* Right Side Chat Interface */}
      <div
        className={`flex-1 flex flex-col ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
      >
        {/* Chat Header */}
        {selectedChat && (
          <header className="flex justify-between items-center bg-blue-600 text-white p-4 shadow-md">
            <div className="flex items-center">
              <img
                src="https://via.placeholder.com/50"
                alt="Admin"
                className="rounded-full w-10 h-10 mr-4"
              />
              <div>
              <h2 className="font-bold">{selectedChatDetails?.title}</h2>
                <p className="text-sm">Online</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="bg-white text-blue-600 text-sm px-4 py-2 rounded-lg shadow-md hover:bg-gray-200"
            >
              Back to Dashboard
            </button>
          </header>
        )}

        {/* Notification Section */}
        {notification && (
          <div className="p-2 bg-yellow-200 text-gray-900 text-sm">
            {notification}
          </div>
        )}

        {/* Chat Messages */}
        <div
          className={`flex-1 overflow-y-auto p-4 ${darkMode ? "bg-gray-900" : "bg-white"}`}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "Client" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`p-3 rounded-lg shadow-md max-w-xs ${
                  message.sender === "Client"
                    ? darkMode
                      ? "bg-blue-700 text-white"
                      : "bg-blue-500 text-white"
                    : darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {message.type === "file" ? (
                  <a
                    href="#"
                    className="underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    {message.content}
                  </a>
                ) : (
                  <p>{message.content}</p>
                )}
                {message.isDeleted ? (
                  <p className="italic text-gray-500">
                    This message was deleted by {message.sender}
                  </p>
                ) : (
                  <>
                    <p>{message.content}</p>
                    {message.edited && (
                      <small className="text-gray-400">Edited</small>
                    )}
                    {message.sender === "Client" && (
                      <div className="mt-2 flex justify-between">
                        <FiEdit
                          className="cursor-pointer text-gray-600"
                          size={16}
                          onClick={() => handleEditMessage(message.id, message.content)}
                        />
                        <FiTrash
                          className="cursor-pointer text-red-600"
                          size={16}
                          onClick={() => handleDeleteMessage(message.id)}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex items-center p-4 bg-gray-800">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
            <FiPaperclip size={20} />
          </label>
          <input
            type="text"
            value={typedMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 ml-4 p-2 rounded-lg bg-gray-700 text-white"
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 p-2 rounded-full bg-blue-600 text-white"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
