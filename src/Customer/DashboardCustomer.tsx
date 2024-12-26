/* eslint-disable no-template-curly-in-string */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { FaFileAlt, FaUpload, FaReceipt, FaUserAlt } from "react-icons/fa";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios, { HttpStatusCode } from "axios";
import { useQuery } from "@tanstack/react-query";
import { getAppUrls } from "../config";
import RentHistory from "./RentHistory";
import AccountModal from "./modal/Account";
import "./css/Sidebar.css";
import { FiMenu } from "react-icons/fi";

const apiBseUrl = getAppUrls().url;

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>(["Maintenance request pending","New tenant added","Payment of ₦20,000 received", "Rent due for Room 12", ]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>( notifications.length);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string>("");
  const [userroomNumber, setUserroomNumber] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [id, setId] = useState<string | null>(null);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
 
  const handleOpenModal = () => {
    setShowAccountDetails(true);
  };
  
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage");
      navigate("/login");
      return;
    }
    axios
      .get(
        `https://rental-management-backend.onrender.com/api/users/profile/${userId}`
      )
      .then((response) => {
        console.log("API Response:", response.data);
        const fullName = response.data.payload?.fullName || "Guest";
        const roomNumber = response.data.payload?.roomNumber || "N/A";
        const role = response.data.payload?.role || "customer"; // Assuming role is returned in the response
        setUserFullName(fullName);
        setUserroomNumber(roomNumber);
        setUserRole(role);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        setUserFullName("User");
        setUserRole("customer, admin");
      });
      
    const socket = io("https://rental-management-backend.onrender.com");
    socket.on("notification", (newNotification: string) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadNotifications((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  const { data: rentDetails,isLoading,isError, error,} = useQuery({
    queryKey: ["fetch-rent-payment-details", id],
    queryFn: async () => {
      const USERID = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      // if (!USERID) {
      //   throw new Error("User ID is not available in local storage");
      // }
      if (!USERID) {
        console.error("User ID is missing. Redirecting to login...");
        throw new Error("User is not authenticated. Please log in again.");
      }
      // if (!id) throw new Error("Rent Payment ID is required");
      const response = await axios.get(
        `https://rental-management-backend.onrender.com/api/RentPayment/fetch/all?size=10&page=1&option=USERID&gSearch=${USERID}&option=STATUS&gSearch=active`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        }
      );
          // Log the response payload
          console.log("API Response for USERID:", USERID, response.data);
      return response.data;
    },
    // enabled: !!id, // Only fetch if id exists
    select: (data) => {
      if (data?.payload?.data?.length > 0) {
        return data.payload.data[0];
      }
      // throw new Error("Rent payment details not found.");
      return null; // Handle empty data gracefully
      
    },
    // onError: (err:any) => {
    //   console.error("Fetch Rent Payment Details Error: ", err);
    // },
  });

  const handleNotificationClick = (notification: string) => {
    setCurrentNotification(notification);
    setIsNotificationModalOpen(true);
    setUnreadNotifications((prev) => Math.max(0, prev - 1));
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalOpen(false); // Close the modal
    setCurrentNotification(null); // Reset the current notification
  };

  const clearNotifications = () => {
    setNotifications([]); // Clear all notifications
  };

  const toggleNavbar = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
console.log(rentDetails)

  return (
    <div className="flex min-h-screen flex-col">

      {/* Main Content */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Summary Cards */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-4">
            <h2
              className="text-4xl font-extrabold text-gradient-to-r from-blue-600 to-teal-500 mb-6 leading-tight"
              style={{
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                transform: "rotateX(0deg) rotateY(0deg)",
                transition:
                  "transform 0.3s ease-in-out, text-shadow 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement; // Assert the type here
                target.style.transform = "rotateX(10deg) rotateY(10deg)";
                target.style.textShadow = "5px 5px 20px rgba(0, 0, 0, 0.4)";
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement; // Assert the type here
                target.style.transform = "rotateX(0deg) rotateY(0deg)";
                target.style.textShadow = "2px 2px 8px rgba(0, 0, 0, 0.3)";
              }}
            >
              Welcome,{" "}
              <span className="text-4xl font-extrabold text-blue-700">
                {userFullName}!
              </span>
            </h2>
          </div>

          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-teal-600">
            Rent Payment Details
            </h3>
            {isLoading ? (
             <div>Loading rent details...</div>
            ) : isError ? (
              <div className="error-message">{isError}</div>
            ) : rentDetails ? (
              <div className="rent-details">
                <p>
                  <strong>Amount:</strong> ₦
                  {rentDetails.paymentAmount
                    ? parseFloat(rentDetails.paymentAmount).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {rentDetails.isActive ? "Paid" : "Due"}
                </p>
                <p>
                  <strong>Next Rent Due Date:</strong>{" "}
                  {new Date(rentDetails.nextRentDueDate).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div>No rent payment details available.</div>
            )}
          </div>

          <div className="bg-teal-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-teal-600">
              Room Occupied
            </h3>
            <p className="text-xl font-bold">{userroomNumber}</p>
          </div>

          <div className="bg-purple-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-purple-600">
              {userFullName}
            </h3>
            <p
              className="text-xl font-bold text-purple-800 cursor-pointer"
              onClick={handleOpenModal} 
            >
              Pay into any of <br />
              the listed Accounts
              <br /> HERE
            </p>
            {showAccountDetails && <AccountModal closeModal={() => setShowAccountDetails(false)} />}
          </div>

        </div>

        {/* Charts Section */}
        <div className="col-span-1 lg:col-span-4 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
              {/* Notifications Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-orange-500">
                  Notifications
                </h2>
                <button
                  className="text-sm text-white bg-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                  onClick={() => clearNotifications()} // Assuming a clearNotifications function exists
                >
                  Clear All
                </button>
              </div>

              {/* Notifications List */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentNotification(notification);
                        setIsNotificationModalOpen(true);
                      }}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md hover:bg-orange-50 transition duration-200"
                    >
                      <p className="text-gray-800 font-semibold truncate">
                        {notification}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-6">
                    <p className="text-gray-500 text-lg">
                      You have no new notifications.
                    </p>
                  </div>
                )}
              </div>

              {/* Notification Modal */}
              {currentNotification && isNotificationModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Notification Details
                    </h3>
                    <p className="text-gray-700">{currentNotification}</p>
                    <div className="mt-6 flex justify-end">
                      <button
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                        onClick={() => {
                          setNotifications(
                            notifications.filter(
                              (notification) =>
                                notification !== currentNotification
                            )
                          );
                          setIsNotificationModalOpen(false);
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <RentHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
function responseObject(arg0: { res: any; statusCode: HttpStatusCode; message: any; }) {
  throw new Error("Function not implemented.");
}

function errorHandler(err: Error, arg1: null) {
  throw new Error("Function not implemented.");
}

