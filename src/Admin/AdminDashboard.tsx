/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AnalyticsData } from "../types";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRooms: 27,
    occupiedRooms: 15,
    totalTenants: 27,
    totalRevenue: 150000,
    outstandingPayments: 20000,
    maintenanceRequests: 5,
  });
  const [notifications, setNotifications] = useState<string[]>([
    "Maintenance request pending",
    "New tenant added",
    "Payment of ₦20,000 received",
    "Rent due for Room 12",
  ]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(
    notifications.length
  );
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<string | null>(
    null
  );
  const [userFullName, setUserFullName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage");
      // navigate("/login");
      return;
    }

    console.log("User ID from localStorage:", userId);
    axios
      .get(
        `https://rental-management-backend.onrender.com/api/users/profile/${userId}`
      )
      .then((response) => {
        console.log("API Response:", response.data);
        const fullName = response.data.payload?.fullName || "User";
        const role = response.data.payload?.role || "customer, admin"; // Assuming role is returned in the response
        setUserFullName(fullName);
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

  const handleNotificationClick = (notification: string) => {
    setCurrentNotification(notification);
    setIsNotificationModalOpen(true);
    setUnreadNotifications((prev) => Math.max(0, prev - 1));
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalOpen(false); // Close the modal
    setCurrentNotification(null); // Reset the current notification
  };

  const handleLogout = async () => {
      const userId = localStorage.getItem("userId");
    const deviceId = localStorage.getItem("deviceId");
    localStorage.clear();
    sessionStorage.clear();
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

      // // Restore deviceId if available
      // if (deviceId) {
      //   localStorage.setItem("deviceId", deviceId);
      // }

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

  const revenueChartOptions = {
    chart: { id: "revenue-trend" },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
  };

  const revenueChartData = [
    { name: "Revenue", data: [12000, 15000, 17000, 22000, 25000, 28000] },
  ];

  const occupancyRateChartOptions = {
    chart: { id: "occupancy-rate" },
    xaxis: { categories: ["Rooms Available", "Rooms Occupied"] },
  };

  const occupancyRateChartData = [{ name: "Occupancy", data: [12, 15] }];

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >

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
            <h3 className="text-lg font-semibold text-teal-600">Total Rooms</h3>
            <p className="text-xl font-bold">{analytics.totalRooms}</p>
          </div>
          <div className="bg-teal-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-teal-600">
              Occupied Rooms
            </h3>
            <p className="text-xl font-bold">{analytics.occupiedRooms}</p>
          </div>

        </div>

        <div className="flex justify-center p-6">
          {/* Notifications Section */}
          <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-xl font-extrabold text-orange-500 mb-4">
              Notifications
            </h2>
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setCurrentNotification(notification);
                      setIsNotificationModalOpen(true);
                    }}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md hover:bg-orange-50 transition duration-200"
                  >
                    <p className="text-gray-700 font-medium truncate">
                      {notification}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">
                    You have no new notifications.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notification Modal */}
          {currentNotification && isNotificationModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Notification Details
                </h3>
                <p className="text-gray-700">{currentNotification}</p>
                <div className="mt-6 flex justify-end">
                  <button
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    onClick={() => {
                      // Mark as read and remove from the list
                      setNotifications(
                        notifications.filter(
                          (notification) => notification !== currentNotification
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

        {/* Charts Section */}
        <div className="col-span-1 lg:col-span-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-center">
                Revenue Trend
              </h3>
              <Chart
                options={revenueChartOptions}
                series={revenueChartData}
                type="line"
                height={300}
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-center">
                Occupancy Rate
              </h3>
              <Chart
                options={occupancyRateChartOptions}
                series={occupancyRateChartData}
                type="bar"
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
