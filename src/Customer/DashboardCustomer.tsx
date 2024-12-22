/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  FiLogOut, FiSearch, FiUser, FiMenu,FiSun, FiMoon,} from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import axios, { HttpStatusCode } from "axios";
import { PaymentHistory, RentDetails } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getAppUrls } from "../config";

const apiBseUrl = getAppUrls().url;

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>(["Maintenance request pending","New tenant added","Payment of ₦20,000 received", "Rent due for Room 12", ]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>( notifications.length);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string>("");
  const [userroomNumber, setUserroomNumber] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [id, setId] = useState<string | null>(null);
 // const [rentDetails, setRentDetails] = useState<RentDetails | null>(null);
  const [paymentHistories, setPaymentHistories] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  //const [error, setError] = useState<string | null>(null);

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

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  }; 



  // useEffect(() => {
  //   const paymentId = localStorage.getItem("id");
  //   console.log("Stored Payment ID:", paymentId);

 
  //   if (!paymentId) {
  //     setError("Payment ID is not available.");
  //     setLoading(false);
  //     return;
  //   }
  //   setId(paymentId);
  // }, []);

// useEffect(() => {
//   if (!id) return;
//     const fetchRentPaymentDetails = async () => {
//       try {
//         const response = await axios.get(
//           `https://rental-management-backend.onrender.com/api/RentPayment/view/${id}`
//         );
//         console.log("API Response Data:", response.data);
//         const { data } = response;
//         if (data && data.payload) {
//           setRentDetails(data.payload);
//         } else {
//           setError("Rent payment details not found.");
//         }
//       } catch (err) {
//         if (err instanceof Error) {
//           setError(err.message || "An error occurred.");
//         } else if (typeof err === "object" && err !== null && "response" in err) {
//           setError((err as any).response?.data?.message || "An error occurred.");
//         } else {
//           setError("An unknown error occurred.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
  

//     fetchRentPaymentDetails();
//   }, [id]);
  

  //     if (response.data && response.data.payload) {
  //       const data = response.data.payload;
  //       console.log("Fetched nextRentDueDate:", data.nextRentDueDate);

  //       if (data.nextRentDueDate && !isNaN(new Date(data.nextRentDueDate).getTime())) {
  //       setNextRentDueDate(data.nextRentDueDate);
  //            } else {
  //       setNextRentDueDate("N/A");
  //       console.warn("Invalid or missing nextRentDueDate:", data.nextRentDueDate);
  //     }
  //       setRentStatus(
  //         data.status ? "Paid" : data.status === false ? "Due" : "Pending"
  //       );
  //     } else {
  //       setError("No rent payment details found.");
  //       console.warn("No payload in API response:", response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching rent payment details:", error);
  //     setError("Failed to fetch rent payment details.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

 
  // useEffect(() => {
  //   const paymentId = localStorage.getItem("paymentId");
  //   if (paymentId) {
  //     console.log("Retrieved Payment ID:", paymentId);
  //     fetchRentPaymentDetails(paymentId);
  //   } else {
  //     console.log("No Payment ID found in localStorage.");
  //   }
  // }, []);

  // const fetchPaymentHistories = async (userId: string) => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       `https://rental-management-backend.onrender.com/api/RentPayment/view/${userId}`);
  //        console.log("Backend Response:", response.data);
  //        const { statusCode, message, payload } = response.data;

  //     if (statusCode === 200 && Array.isArray(payload)) {
  //       const rentPaymentIds = payload.map((payment) => payment.id);
  //       setPaymentHistories(payload);
  //       setError("");
  //     } else if (statusCode === 404) {
  //       setPaymentHistories([]);
  //       setError(message || "No rent payment histories found for this user.");
  //     } else {
  //       throw new Error(message || "Unexpected response from the server.");
  //     }
  //   } catch (err) {
  //     if (axios.isAxiosError(err)) {
  //       setError(err.response?.data?.message || "Internal server error occurred. Please try again later.");
  //     } else {
  //       setError("An unexpected error occurred.");
  //     }
  //     setPaymentHistories([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const userId = localStorage.getItem("userId"); 
  //   if (userId) {
  //     fetchPaymentHistories(userId);
  //   } else {
  //     setError("No user ID found. Please log in.");
  //     setLoading(false);
  //   }
  // }, []);

  const {
    data: rentDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fetch-rent-payment-details", id],
    queryFn: async () => {
        const USERID = localStorage.getItem("userId");
         const token = localStorage.getItem("token"); 
    if (!USERID) {
      throw new Error("User ID is not available in local storage");
    }
     // if (!id) throw new Error("Rent Payment ID is required");
      const response = await axios.get(
        `${apiBseUrl}RentPayment/fetch/all?size=10&page=1&option=USERID&gSearch=${USERID}&option=STATUS&gSearch=active`,
         {
        headers: {
          "Authorization": `Bearer ${token}`,  // Add Authorization header
        }
      }
      );
      return response.data;
    },
   // enabled: !!id, // Only fetch if id exists
    select: (data) => {
      if (data?.payload) {
        return data.payload.data[0]; // Transform data if needed
      }
      throw new Error("Rent payment details not found.");
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

 const handleLogout = async () => {
      const userId = localStorage.getItem("userId");
    const deviceId = localStorage.getItem("deviceId");
  
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Restore deviceId
    if (deviceId) {
      localStorage.setItem("deviceId", deviceId);
    }
   try {
    // Call the logout endpoint
    const response = await axios.post(
      "https://rental-management-backend.onrender.com/api/users/logout",
      { userId },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.status === 200) {
      // Successfully logged out
      alert("Logged out successfully from all devices!");

      // Clear sensitive data from storage
      localStorage.clear();
      sessionStorage.clear();
      document.cookie =
        "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Navigate to the login page
      navigate("/login");
    }
  } catch (err) {
    // Handle errors
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        console.warn("User no longer exists on the backend.");
        alert("User account not found. Please sign up again.");
        navigate("/login");
      } else {
        console.error("Error during logout:", err.message);
        alert("Failed to log out from all devices. Please try again.");
      }
    } else if (err instanceof Error) {
      console.error("Unexpected error during logout:", err.message);
      alert("An unexpected error occurred. Please try again.");
    } else {
      console.error("Unknown error during logout:", err);
    }
  }
};

// useEffect(() => {

//   const savedRentDetails = localStorage.getItem("rentPaymentDetails");
  
//   if (savedRentDetails) {
//     const rentDetails = JSON.parse(savedRentDetails);
//     setRentDetails(rentDetails);
//     setLoading(false); 
//     console.log("Retrieved Rent Payment Details:", rentDetails);
//   } else {
//     setLoading(false);
//     console.log("No rent payment details found in localStorage.");
//   }
// }, []);
console.log(rentDetails)

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Navbar */}
      <nav
        className={`shadow-md p-4 flex justify-between items-center ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center space-x-4">
          <button
            className="text-gray-700 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FiMenu size={28} />
          </button>
          <AiOutlineHome size={28} className="text-blue-600" />
          <h1 className="text-2xl font-bold">Akpaden Hostel Management</h1>
        </div>

        <div className="hidden lg:flex items-center space-x-6">
          {[
            { label: "Requests", href: "/customer/maintenance" },
            { label: "Upload Receipts", href: "/customer/receipts" },
            { label: "Tenancy Receipt", href: "/customer/maintenance" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-2 px-4 hover:text-blue-500 hover:underline focus:ring focus:ring-blue-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme}>
            {theme === "dark" ? (
              <FiSun size={24} className="text-yellow-500" />
            ) : (
              <FiMoon size={24} className="text-gray-700" />
            )}
          </button>
          <div className="relative">
            <FiSearch
              size={20}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg bg-gray-100 focus:outline-none"
            />
          </div>
          <FiUser
            size={28}
            className="text-blue-600 cursor-pointer"
            onClick={() => (window.location.href = "/customer/profile")}
          />
          <FiLogOut
            size={28}
            className="text-red-500 cursor-pointer"
            onClick={handleLogout}
          />
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-100 p-4">
          {[
            { label: "Requests", href: "/customer/maintenance" },
            { label: "Upload Receipts", href: "/customer/receipts" },
            { label: "Tenancy Receipt", href: "/customer/maintenance" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 hover:text-blue-500"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
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
              <div>Loading...</div>
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
              onClick={() => navigate("/customer/accounts")}
            >
              Pay into any of <br />
              the listed Accounts
              <br /> HERE
            </p>
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
              <h3 className="text-xl font-semibold text-center mb-4">
                Rent Payment History
              </h3>

              {/* <div>
                {error ? (
                  <div className="error-message">{error}</div>
                ) : paymentHistories.length > 0 ? (
                  <div className="rent-history">
                    <h2>Rent Payment History</h2>
                    <table>
                      <thead>
                        <tr>
                          <th>Payment ID</th>
                          <th>Amount (₦)</th>
                          <th>Status</th>
                          <th>Payment Date</th>
                          <th>Next Rent Due Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistories.map((payment) => (
                          <tr key={payment.id}>
                            <td>{payment.id}</td>
                            <td>{payment.amount.toLocaleString()}</td>
                            <td>{payment.status}</td>
                            <td>
                              {new Date(
                                payment.paymentDate
                              ).toLocaleDateString()}
                            </td>
                            <td>
                              {new Date(
                                payment.nextRentDueDate
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>No rent payment history found.</div>
                )}
              </div> */}

              {/* Filter Section */}
              {/* <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  placeholder="Search payments..."
                  className="border border-gray-300 rounded-lg px-4 py-2 w-1/3"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2"
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">Filter by Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-4 py-2"
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div> */}

              {/* Payment History Table */}
              {/* <div className="overflow-x-auto"> */}
              {/* <table className="table-auto w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        Date
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        Description
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        Amount
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2">
                            {payment.date}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {payment.description}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {payment.amount}
                          </td>
                          <td
                            className={`border border-gray-200 px-4 py-2 ${
                              payment.status === "success"
                                ? "text-green-500"
                                : payment.status === "pending"
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          >
                            {payment.status}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="border border-gray-200 px-4 py-2 text-center text-gray-500"
                        >
                          No payment history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div> */}
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

