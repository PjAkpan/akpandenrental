/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect, ChangeEvent, ReactNode } from "react";
import { FiSearch, FiPaperclip, FiSend, FiCamera } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { initializeWebSocket, closeWebSocket } from "../../utils/websocket";

interface Chat {
  user: any;
  text: ReactNode;
  sent: any;
  id: number;
  name: string;
  message: string;
  lastActive: string;
  image: string;
}

interface Message {
  text: string;
  file: string | null;
  timestamp: string;
}

const RequestStatus: React.FC = () => {
  const [userImage, setUserImage] = useState<string>(
    "https://via.placeholder.com/80"
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("John Doe");
  const [chatData, setChatData] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [typedMessage, setTypedMessage] = useState<string>("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const navigate = useNavigate();

  const avatarImages = {
    male: [
      "https://res.cloudinary.com/dorttcm29/image/upload/v1731939908/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector-4067145648_gdnucu.jpg",
      "https://res.cloudinary.com/dorttcm29/image/upload/v1731939908/pngtree-man-avatar-isolated-png-image_9935818-2120792502_fupwgi.png",
      "https://res.cloudinary.com/dorttcm29/image/upload/v1731941476/2079979_jhihge.png",
    ],
    female: [
      "https://res.cloudinary.com/dorttcm29/image/upload/v1731939908/beautiful-woman-avatar-character-icon-free-vector-1316470041_ntzweu.jpg",
      "https://res.cloudinary.com/dorttcm29/image/upload/v1731939908/beautiful-woman-avatar-character-icon-free-vector-3045800833_yqctcq.jpg",
      "https://res.cloudinary.com/dorttcm29/image/upload/v1731941476/profile-picture-icon-12_eoaes4.png",
    ],
  };

  const handleCreateNewRequest = () => {
    navigate("/maintenance");
  };

  // const handleTyping = () => setIsTyping(true);
  // const handleStopTyping = () => setIsTyping(false);

  // Function to load more messages
  const loadMoreMessages = async () => {
    console.log("Loading more messages...");

    try {
      const newMessages = await fetch(
        `https://api.example.com/messages?page=${page}`
      )
        .then((response) => response.json())
        .then((data) => data.messages);

      setChatData((prevChatData) => [...newMessages, ...prevChatData]);

      // Update page for the next fetch
      setPage((prevPage) => prevPage + 1);

      console.log("Messages loaded successfully:", newMessages.length);
    } catch (error) {
      console.error("Error loading more messages:", error);
    }
  };
  // Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) {
        alert("File is too large");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setShowModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelection = (avatarUrl: string) => {
    setUserImage(avatarUrl);
    setShowModal(false);
  };

  const handleChatSelection = (chatId: number) => {
    const selected = chatData.find((chat) => chat.id === chatId) || null;
    setSelectedChat(selected);
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userDetails");
    navigate("/login");
  };
  const handleFileUpload = (file: File) => {
    if (file) {
      setAttachedFile(file);
      alert(`File "${file.name}" has been attached.`);
    }
  };

  // WebSocket connection for live updates
  useEffect(() => {
    const onNewMessage = (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    const ws = initializeWebSocket(
      "ws://your-websocket-server-url",
      onNewMessage
    );

    return () => closeWebSocket();
  }, []);

  const handleSendMessage = () => {
    if (!typedMessage && !attachedFile) {
      alert("Please type a message or attach a file.");
      return;
    }

    const message: Message = {
      text: typedMessage,
      file: attachedFile ? attachedFile.name : null,
      timestamp: new Date().toLocaleString(),
    };

    console.log("Message sent:", message);
    // Add message to the chat window (pseudo-code):
    setMessages([...messages, message]);

    // Clear the input and file after sending
    setTypedMessage("");
    setAttachedFile(null);
  };

  const testChatData = [
    {
      id: 1,
      name: "Lucy Robin",
      message:
        "Hello! Finally found the time \n to write to you.I need your help in \n creating interactive animations for \n my mobile application.",
      lastActive: "1 minute ago",
      image: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      name: "Jared Sunn",
      message: "Voice message",
      lastActive: "1 minute ago",
      image: "https://via.placeholder.com/50",
    },
    {
      id: 3,
      name: "Nika Jerrado",
      message: "Request to fix the server down issue.",
      lastActive: "5 hours ago",
      image: "https://via.placeholder.com/50",
    },
    {
      id: 4,
      name: "Jane Smith",
      image: "https://via.placeholder.com/150",
      message: "Query about billing issues.",
      lastActive: "1 day ago",
    },
  ];

  const formatMessage = (message: string) =>
    message.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/chatData");
        if (!response.ok) throw new Error("Failed to fetch chat data");
        const data: Chat[] = await response.json();
        setChatData(data.length ? data : []);
      } catch (error) {
        console.error("Error fetching chat data:", error);
        setChatData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-white shadow-md p-4">
        <div className="text-center mb-8">
          {/* Profile Image Section */}
          <div className="relative">
            <img
              src={userImage}
              alt="Profile"
              className="rounded-full mx-auto mb-4 w-20 h-20"
            />
            <button
              className="absolute bottom-0 right- -3 bg-blue-500 text-white p-1 rounded-full text-xs"
              onClick={() => setShowModal(true)}
            >
              <FiCamera />
            </button>
          </div>

          <h2 className="font-bold text-lg mt-4">{userName}</h2>
        </div>

        <nav className="flex flex-col space-y-4">
          <button
            className="text-gray-600 hover:text-blue-600 flex items-center space-x-2"
            onClick={() => (window.location.href = "/dashboard")}
          >
            <span>🏠</span> <span>Home</span>
          </button>
          <button
            className="text-gray-600 hover:text-blue-600 flex items-center space-x-2"
            onClick={() => (window.location.href = "/notifications")}
          >
            <span>🔔</span> <span>Notifications</span>
          </button>
          <button
            className="text-gray-600 hover:text-blue-600 flex items-center space-x-2"
            onClick={() => (window.location.href = "/contact")}
          >
            <span>📋</span> <span>Contact</span>
          </button>
        </nav>

        <button
          className="text-red-600 hover:text-red-800 mt-12"
          onClick={() => {
            logout();
            alert("You have been logged out");
          }}
        >
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <div className="w-full md:w-3/4 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
              <p className="mt-4 text-blue-500 font-semibold">Loading...</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Chats</h1>
              <button
                onClick={handleCreateNewRequest}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 md:mt-0"
              >
                + Create New Request
              </button>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Recent Chats */}
              <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-4 overflow-auto max-h-[80vh]">
                <div className="flex items-center bg-gray-100 p-2 rounded-md mb-4">
                  <FiSearch className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-100 outline-none ml-2 text-sm w-full"
                  />
                </div>

                {/* Chat List */}
                {chatData.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelection(chat.id)}
                    className={`flex items-center space-x-4 p-2 border-b border-gray-200 cursor-pointer ${
                      selectedChat && selectedChat.id === chat.id
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {/* Profile Image */}
                    <img
                      src={chat.image}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">
                        {chat.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {formatMessage(chat.message)}
                      </p>
                    </div>

                    {/* Last Active */}
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {chat.lastActive}
                    </span>
                  </div>
                ))}
              </div>
              {/* Chat Window */}
              {selectedChat ? (
                <div className="w-full md:w-2/3 bg-white shadow-md rounded-lg p-4 mt-4 md:mt-0 md:ml-4">
                  {/* Chat Header */}
                  <div className="flex items-center mb-4">
                    <img
                      src={selectedChat.image}
                      alt={selectedChat.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="ml-4">
                      <h2 className="font-bold">{selectedChat.name}</h2>
                      <p className="text-sm text-gray-500">
                        Last active: {selectedChat.lastActive}
                      </p>
                    </div>
                  </div>

                  <div className="chat-container">
                    {/* Chat Messages */}
                    <div className="messages">
                      {chatData.map((message, index) => (
                        <div key={index} className="message">
                          <div className="flex items-center space-x-2">
                            {/* Profile Image with Hover Effect */}
                            <img
                              src={message.user.image}
                              alt={message.user.name}
                              className="w-12 h-12 rounded-full object-cover transition-transform duration-200 transform hover:scale-110"
                            />
                            <div className="message-content">
                              <p>{message.text}</p>
                              {/* Sent Status */}
                              {message.sent ? (
                                <span className="text-xs text-gray-500">
                                  Delivered
                                </span>
                              ) : (
                                <span className="text-xs text-gray-500">
                                  Sending...
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="text-sm text-gray-400 italic">
                      User is typing...
                    </div>
                  )}

                  {/* Load More Button */}
                  {chatData.length > 10 && (
                    <button
                      onClick={() => loadMoreMessages()}
                      className="text-blue-500 mt-4"
                    >
                      Load More Messages
                    </button>
                  )}

                  {/* Chat Input */}
                  <div className="flex items-center mt-4">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        const fileInput = document.getElementById("fileInput");
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                    >
                      <FiPaperclip className="text-lg" />
                    </button>

                    <input
                      id="fileInput"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    />

                    <input
                      type="text"
                      placeholder="Type your message"
                      className="w-full p-2 border border-gray-300 rounded-lg ml-2"
                      value={typedMessage}
                      onChange={(e) => setTypedMessage(e.target.value)}
                    />
                    <button
                      className="text-blue-500 hover:text-blue-700 ml-2"
                      onClick={handleSendMessage}
                    >
                      <FiSend className="text-lg" />
                    </button>
                  </div>
                </div>
              ) : null}
              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-4 rounded-lg w-1/3">
                    <h2 className="text-xl font-bold mb-4">Choose an Avatar</h2>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(avatarImages).map(([gender, avatars]) => (
                        <div key={gender}>
                          <h3 className="font-semibold mb-2">
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </h3>
                          {avatars.map((avatar, index) => (
                            <img
                              key={index}
                              src={avatar}
                              alt={`Avatar ${index}`}
                              className="w-20 h-20 rounded-full cursor-pointer hover:opacity-80"
                              onClick={() => handleAvatarSelection(avatar)}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <button
                      className="mt-4 bg-gray-500 text-white p-2 rounded-lg w-full"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
              ;
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default RequestStatus;
