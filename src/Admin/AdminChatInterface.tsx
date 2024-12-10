/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, ChangeEvent } from "react";
import io from "socket.io-client";
import { FiPaperclip, FiSend, FiEdit, FiTrash, FiSun, FiMoon } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Message } from "../types";

const socket = io("https://rental-management-backend.onrender.com", {
  transports: ["websocket"], 
  reconnection: true,
});



const AdminChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typedMessage, setTypedMessage] = useState<string>("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [notification, setNotification] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<string | null>("Chat with Tenant");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  const toggleDarkMode = () => setDarkMode(!darkMode);

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
        sender: "Admin",
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

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    // Listen for messages from tenant
    socket.on("tenantMessage", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Listen for typing event
    socket.on("tenantTyping", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));

    return () => {
      socket.off("tenantMessage");
      socket.off("tenantTyping");
      socket.off("stopTyping");
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedMessage(e.target.value);
    if (e.target.value) socket.emit("adminTyping");
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

        <div
          className={`p-3 flex justify-between items-center ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"} rounded-lg shadow-md mb-2 cursor-pointer`}
          onClick={handleChatToggle}
        >
          <span>Chat with Tenant</span>
        </div>
      </div>

      {/* Right Side Chat Interface */}
      <div className={`flex-1 flex flex-col ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        {/* Chat Header */}
        {isChatOpen && selectedChat && (
          <header className="flex justify-between items-center bg-blue-600 text-white p-4 shadow-md">
            <div className="flex items-center">
              <img
                src="https://via.placeholder.com/50"
                alt="Tenant"
                className="rounded-full w-10 h-10 mr-4"
              />
              <div>
                <h2 className="font-bold">{selectedChat}</h2>
                <p className="text-sm">Online</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
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
        {isChatOpen && (
          <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "Admin" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`p-3 rounded-lg shadow-md max-w-xs ${
                    message.sender === "Admin"
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
                        <small className="block text-xs text-gray-400 italic">
                          (Edited)
                        </small>
                      )}
                    </>
                  )}
                  <small className="block text-xs mt-2 text-gray-400">
                    {message.timestamp}
                  </small>
                  {message.sender === "Admin" && !message.isDeleted && (
                    <div className="flex justify-end mt-2">
                      <FiEdit
                        className="text-gray-500 mx-2 cursor-pointer"
                        onClick={() =>
                          handleEditMessage(message.id, message.content)
                        }
                      />
                      <FiTrash
                        className="text-gray-500 cursor-pointer"
                        onClick={() => handleDeleteMessage(message.id)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center px-4 py-2">
            <p className="text-gray-500 text-sm">Tenant is typing...</p>
          </div>
        )}

        {/* Chat Input */}
        {isChatOpen && (
          <div className="flex items-center bg-white p-4 shadow-md">
            <label htmlFor="file-upload" className="cursor-pointer mr-2">
              <FiPaperclip className="text-gray-500 text-xl" />
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <input
              type="text"
              placeholder="Type a message"
              value={typedMessage}
              onChange={handleInputChange}
              className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              <FiSend />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatInterface;
