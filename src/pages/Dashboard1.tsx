/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { FiLogOut, FiBell, FiSearch, FiSettings, FiUser, FiMenu } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import Chart from "react-apexcharts";
import SkeletonLoader from "../utils/Skeleton/Skeleton";
import axios from "axios";

type AnalyticsData = {
  [key: string]: number;
};

const AnalyticsDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRooms: 27,
    occupiedRooms: 27,
    totalTenants: 27,
    totalRevenue: 150000,
    outstandingPayments: 20000,
    maintenanceRequests: 5,
  });
  const [notifications, setNotifications] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAnalytics, setFilteredAnalytics] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");  // Light/Dark Theme Toggle
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [role, setRole] = useState<string | null>(null);   // Role: user or admin

    // Fetch role after login from backend (Simulated)
    useEffect(() => {
      const storedRole = localStorage.getItem("role");
      if (storedRole) setRole(storedRole);
    }, [])

  // Real-time Analytics Update every 5 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      fetchAnalyticsData();
    }, 300000); // Refresh every 5 minutes
    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, []);

  const fetchAnalyticsData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAnalytics({
        totalRooms: 50,
        occupiedRooms: 45,
        totalTenants: 48,
        totalRevenue: 150000,
        outstandingPayments: 20000,
        maintenanceRequests: 5,
      });
      setNotifications([
        "Maintenance request pending",
        "New tenant added",
        "Payment of ₦20,000 received",
        "Rent due for Room 12",
      ]);
      setIsLoading(false);
      setUnreadNotifications(notifications.length); // Update unread notifications count
    }, 2000);
  };

  useEffect(() => {
    // Filter analytics dynamically based on the search query
    const filtered = Object.entries(analytics).reduce<AnalyticsData>((acc, [key, value]) => {
      if (key.toLowerCase().includes(searchQuery.toLowerCase())) {
        acc[key] = value;
      }
      return acc;
    }, {});
    setFilteredAnalytics(filtered);
  }, [searchQuery, analytics]);

  // Handle Notification Mark as Read/Unread
  const handleNotificationClick = (index: number) => {
    setNotifications(notifications.map((notif, i) => i === index ? `✔️ ${notif}` : notif));
    setUnreadNotifications(unreadNotifications - 1); // Decrease unread count
  };

  const handleDeleteNotification = (index: number) => {
    setNotifications(notifications.filter((_, i) => i !== index));
    setUnreadNotifications(unreadNotifications - 1); // Decrease unread count
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
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} flex flex-col`}>
      {/* Navbar */}
      <nav className={`bg-white shadow-md p-4 flex justify-between items-center ${theme === "dark" ? "bg-gray-900 text-white" : ""}`}>
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FiMenu size={28} />
          </button>
          <AiOutlineHome size={28} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        </div>
        <div className="hidden lg:flex space-x-6">
          {role === "admin" && (
            <>
              <a href="/admin/maintenance" className="hover:text-blue-500">Maintenance</a>
              <a href="/admin/payments" className="hover:text-blue-500">Payments</a>
            </>
          )}
          <a href="/profile" className="hover:text-blue-500">My Account</a>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search analytics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg bg-gray-100 focus:outline-none"
            />
          </div>
          <FiBell size={28} className="text-orange-500 cursor-pointer" />
          <div className="relative">
            <FiUser size={28} className="text-blue-600 cursor-pointer" />
            {unreadNotifications > 0 && (
              <div className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                {unreadNotifications}
              </div>
            )}
          </div>
          <FiLogOut size={28} className="text-red-500 cursor-pointer" />
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-white shadow-lg p-4 lg:hidden">
          <ul className="space-y-2">
            <li className="hover:text-blue-500"><a href="/profile">My Account</a></li>
            {role === "admin" && (
              <>
                <li className="hover:text-blue-500"><a href="/admin/maintenance">Maintenance</a></li>
                <li className="hover:text-blue-500"><a href="/admin/payments">Payments</a></li>
              </>
            )}
          </ul>
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
            <h3 className="text-lg font-semibold text-green-600">Occupied Rooms</h3>
            <p className="text-xl font-bold">{analytics.occupiedRooms}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-yellow-600">Outstanding Payments</h3>
            <p className="text-xl font-bold">₦{analytics.outstandingPayments}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="col-span-1 lg:col-span-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-center">Revenue Trend</h3>
              <Chart options={revenueChartOptions} series={revenueChartData} type="line" height={300} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-center">Occupancy Rate</h3>
              <Chart options={occupancyRateChartOptions} series={occupancyRateChartData} type="bar" height={300} />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="col-span-1 lg:col-span-4 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Notifications</h3>
          <ul className="space-y-2">
            {notifications.map((notif, index) => (
              <li
                key={index}
                className="flex justify-between items-center"
                onClick={() => handleNotificationClick(index)}
              >
                <span className={`text-gray-700 ${notif.startsWith("✔️") ? "line-through" : ""}`}>
                  {notif}
                </span>
                <button
                  className="text-red-600 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNotification(index);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
