
import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/MaintenanceModal.css";
import { ModalProps } from "../../types";



const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
  const navigate = useNavigate();

  const handleSubmitAnotherRequest = () => {
    navigate('/customer/maintenance');  
    onClose();  
  };

  const handleGoToDashboard = () => {
    navigate('/customer/dashboard'); 
    onClose();  
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <div className="modal-actions">
          <button onClick={handleSubmitAnotherRequest}>Submit Another Request</button>
          <button onClick={handleGoToDashboard}>Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
