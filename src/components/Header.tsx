import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide back button on the dashboard page
  const isDashboardPage = location.pathname.includes('dashboard') && (
    location.pathname === '/dashboard' ||
    location.pathname === '/admin/dashboard' ||
    location.pathname === '/customer/dashboard'
  );

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <header style={headerStyle}>
      <div style={logoContainerStyle}>
        <img src="/logo.png" alt="Logo" style={logoStyle} />
        <h1 style={titleStyle}>Akpaden Hostel</h1>
      </div>
      <nav style={navStyle}>
        <ul style={navListStyle}>
          <li style={navItemStyle}><a href="/">Home</a></li>
          <li style={navItemStyle}><a href="/dashboard">About</a></li>
          <li style={navItemStyle}><a href="/contact">Contact</a></li>
        </ul>
      </nav>
      {/* Conditionally render the back button */}
      {!isDashboardPage && (
        <button onClick={handleBackClick} style={backButtonStyle}>← Back</button>
      )}
    </header>
  );
};

const headerStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#4A90E2',  // Blue background
  color: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
};

const logoContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const logoStyle: React.CSSProperties = {
  height: '40px',
  marginRight: '10px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#fff',
};

const navStyle: React.CSSProperties = {
  flexGrow: 1,
};

const navListStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const navItemStyle: React.CSSProperties = {
  margin: '0 20px',
  fontSize: '16px',
};

const backButtonStyle: React.CSSProperties = {
  position: 'absolute',
  left: '20px',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'transparent',
  border: 'none',
  color: '#fff',
  fontSize: '18px',
  cursor: 'pointer',
};

export default Header;
