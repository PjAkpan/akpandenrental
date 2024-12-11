/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  FiLogOut,
  FiBell,
  FiSearch,
  FiSettings,
  FiUser,
  FiMenu,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import Chart from "react-apexcharts";
import  io  from "socket.io-client"; 
import { useNavigate } from 'react-router-dom';
import axios from "axios";

type AnalyticsData = {
  totalRooms: number;
  occupiedRooms: number;
  totalTenants: number;
  totalRevenue: number;
  outstandingPayments: number;
  maintenanceRequests: number;
};

const HostelDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRooms: 50,
    occupiedRooms: 45,
    totalTenants: 48,
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

  useEffect(() => {
    const socket = io("https://rental-management-backend.onrender.com"); 
    socket.on("notification", (newNotification: string) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadNotifications((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  // Toggle Theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleNotificationClick = (notification: string) => {
    setIsNotificationModalOpen(true);
    setUnreadNotifications((prev) => Math.max(0, prev - 1));
  };

  const handleLogout = () => {
    const deviceId = localStorage.getItem("deviceId");
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // Restore deviceId
  if (deviceId) {
    localStorage.setItem("deviceId", deviceId);
  }
    alert("Logged out successfully!");
    navigate('/login');

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

  const occupancyRateChartData = [
    { name: "Occupancy", data: [5, 45] },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
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
        <div className="hidden lg:flex space-x-6">
          <a href="/admin/maintenance" className="hover:text-blue-500">
            Requests
          </a>
          <a href="/admin/tenants" className="hover:text-blue-500">
            Tenants
          </a>
          <a href="/admin/payment" className="hover:text-blue-500">
            Payments
          </a>
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
            <FiSearch size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg bg-gray-100 focus:outline-none"
            />
          </div>
          <div className="relative">
            <FiBell size={28} className="text-orange-500 cursor-pointer" />
            {unreadNotifications > 0 && (
              <div className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                {unreadNotifications}
              </div>
            )}
          </div>
          <FiUser
            size={28}
            className="text-blue-600 cursor-pointer"
            onClick={() => (window.location.href = "/profile")}
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
          <a href="/admin/maintenance" className="block py-2 hover:text-blue-500">
          Requests
          </a>
          <a href="/admin/tenants" className="block py-2 hover:text-blue-500">
            Tenants
          </a>
          <a href="/admin/payment" className="block py-2 hover:text-blue-500">
            Payments
          </a>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Summary Cards */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-blue-600">Total Rooms</h3>
            <p className="text-xl font-bold">{analytics.totalRooms}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-green-600">
              Occupied Rooms
            </h3>
            <p className="text-xl font-bold">{analytics.occupiedRooms}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-yellow-600">
              Outstanding Payments
            </h3>
            <p className="text-xl font-bold">₦{analytics.outstandingPayments}</p>
          </div>
        </div>

           {/* Notifications Modal */}
      {isNotificationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Notifications</h2>
            <ul>
              {notifications.map((notification, index) => (
                <li
                  key={index}
                  className="mb-2 cursor-pointer hover:text-blue-500"
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setIsNotificationModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

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

export default HostelDashboard;
