/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, ChangeEvent } from "react";
import io from "socket.io-client";
import {
  FiPaperclip,
  FiSend,
  FiEdit,
  FiTrash,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const socket = io("https://rental-management-backend.onrender.com", {
  transports: ["websocket"], // Ensures a stable connection
  reconnection: true,
});

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  type: "text" | "file";
  edited?: boolean;
  isDeleted?: boolean;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typedMessage, setTypedMessage] = useState<string>("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [notification, setNotification] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chats, setChats] = useState<{ name: string; unreadCount: number }[]>([
    { name: "Chat with Admin", unreadCount: 3 },
    { name: "Old Chat 1", unreadCount: 0 },
    { name: "Old Chat 2", unreadCount: 1 },
    { name: "Old Chat 3", unreadCount: 0 },
  ]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleChatClick = (chatName: string) => {
    setSelectedChat(chatName);
    setMessages([]); // Reset messages when switching chats
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
    // Listen for typing event
    socket.on("adminTyping", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));
    return () => {
      socket.off("adminTyping");
      socket.off("stopTyping");
    };
  }, []);

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
      className={`h-screen flex ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`w-1/4 ${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
        } p-4 overflow-y-auto`}
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
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`p-3 flex justify-between items-center ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
            } rounded-lg shadow-md mb-2 cursor-pointer hover:${
              darkMode ? "bg-gray-600" : "bg-gray-300"
            } ${selectedChat === chat.name ? "border-2 border-blue-500" : ""}`}
            onClick={() => handleChatClick(chat.name)}
          >
            <span>{chat.name}</span>
            {chat.unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {chat.unreadCount}
              </span>
            )}
          </div>
        ))}
        <button
          onClick={() => navigate("/admin/maintenance")}
          className={`w-full mt-4 ${
            darkMode
              ? "bg-blue-700 hover:bg-blue-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white py-2 rounded-lg`}
        >
          New Maintenance Request
        </button>
      </div>

      {/* Right Side Chat Interface */}
      <div
        className={`flex-1 flex flex-col ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
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
        <div
          className={`flex-1 overflow-y-auto p-4 ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
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
                      <small className="block text-xs text-gray-400 italic">
                        (Edited)
                      </small>
                    )}
                  </>
                )}
                <small className="block text-xs mt-2 text-gray-400">
                  {message.timestamp}
                </small>
                {message.sender === "Client" && !message.isDeleted && (
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

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center px-4 py-2">
            <p className="text-gray-500 text-sm">Admin is typing...</p>
          </div>
        )}

        {/* Chat Input */}
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
      </div>
    </div>
  );
};

export default ChatInterface;
