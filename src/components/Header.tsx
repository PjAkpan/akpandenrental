/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai";
import axios from "axios";
import './css/Header.css'; 
import { FaDoorOpen, FaBars } from "react-icons/fa"; 
import { useUser } from '../context/UserContext'; 

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin, isCustomer } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);
  const noHeaderPages = ['/login', '/signup', '/'];

  const shouldHideHeader = noHeaderPages.includes(location.pathname);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    const userId = localStorage.getItem("userId");
    const deviceId = localStorage.getItem("deviceId");

    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    if (deviceId) {
      localStorage.setItem("deviceId", deviceId);
    }

    try {
      const response = await axios.post(
        "https://rental-management-backend.onrender.com/api/users/logout",
        { userId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Logged out successfully from all devices!");
        localStorage.clear();
        sessionStorage.clear();
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/login");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          alert("User account not found. Please sign up again.");
          navigate("/login");
        } else {
          alert("Failed to log out from all devices. Please try again.");
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (shouldHideHeader) {
    return null;
  }

  return (
    <div className="header-wrapper">
      <header className="header">
        <div className="header-content">
          <div className="flex items-center space-x-4">
            <button className="burger-menu" onClick={toggleMenu}>
              <FaBars size={28} />
            </button>
            <AiOutlineHome size={28} className="text-blue-600" />
            <h1 className="title">
              {userRole === "admin" ? 'Akpaden Hostel Management' : 'Akpaden Hostel'}
            </h1>
          </div>

          <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
            {isAdmin ? (
                <>
                  <li className="nav-item"><a href="/admin/dashboard" className="nav-link">Home</a></li>
                  <li className="nav-item"><a href="/admin/rooms" className="nav-link">Rooms</a></li>
                  <li className="nav-item"><a href="/admin/maintenance" className="nav-link">Requests</a></li>
                  <li className="nav-item"><a href="/admin/tenants" className="nav-link">Tenants</a></li>
                  <li className="nav-item"><a href="/admin/payment" className="nav-link">Payments</a></li>
                  <li className="nav-item"><a href="/admin/profile" className="nav-link">My Account</a></li>
                </>
              ) : isCustomer ? (
                <>
                <li className="nav-item"><a href="/customer/dashboard" className="nav-link">Home</a></li>
                  <li className="nav-item"><a href="/customer/maintenance" className="nav-link">Requests</a></li>
                  <li className="nav-item"><a href="/customer/receipts" className="nav-link">Upload Receipts</a></li>
                  <li className="nav-item"><a href="/customer/tenancy" className="nav-link">Tenancy Receipts</a></li>
                  <li className="nav-item"><a href="/customer/profile" className="nav-link">My Account</a></li>
                </>
                 ) : (
                <li className="nav-item"><a href="/" className="nav-link">Home</a></li>
              )}
            </ul>
          </nav>

          <div className="logout-container">
            <FaDoorOpen size={28} className="logout-icon" onClick={handleLogout} />
          </div>
        </div>

        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="mobile-nav-list">
          {isAdmin ? (
              <>
                <li className="mobile-nav-item"><a href="/admin/dashboard" className="nav-link">Home</a></li>
                <li className="mobile-nav-item"><a href="/admin/rooms" className="nav-link">Rooms</a></li>
                <li className="mobile-nav-item"><a href="/admin/maintenance" className="nav-link">Requests</a></li>
                <li className="mobile-nav-item"><a href="/admin/tenants" className="nav-link">Tenants</a></li>
                <li className="mobile-nav-item"><a href="/admin/payment" className="nav-link">Payments</a></li>
                <li className="mobile-nav-item"><a href="/admin/profile" className="nav-link">My Account</a></li>
              </>
                 ) : isCustomer ? (
              <>
                <li className="mobile-nav-item"><a href="/customer/dashboard" className="nav-link">Home</a></li>
                <li className="mobile-nav-item"><a href="/customer/maintenance" className="nav-link">Requests</a></li>
                <li className="mobile-nav-item"><a href="/customer/receipts" className="nav-link">Upload Receipts</a></li>
                <li className="mobile-nav-item"><a href="/customer/tenancy" className="nav-link">Tenancy Receipts</a></li>
                <li className="mobile-nav-item"><a href="/customer/profile" className="nav-link">My Account</a></li>
              </>
                 ) : (
                  <li className="mobile-nav-item"><a href="/" className="nav-link">Home</a></li>
                )}
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
