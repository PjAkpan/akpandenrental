import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/css/UnauthorizedPage.css";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page">
      <div className="container">
        <h1 className="error-title">Oops! Unauthorized Access</h1>
        <p className="error-message">
          It seems like you don’t have the necessary permissions to view this page.
        </p>
        <button
          className="go-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Go Back to Dashboard
        </button>
      </div>
      <div className="animation">
        <div className="animation-circle"></div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
