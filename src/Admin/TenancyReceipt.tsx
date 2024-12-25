/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SignatureCanvas from "react-signature-canvas"; 
import "./css/TenancyReceipt.css";

const TenancyReceipt = ({ paymentId }: { paymentId: string }) => {
  const [receiptData, setReceiptData] = useState({
    tenantName: "",
    roomNumber: "",
    amountPaid: "",
    paymentDate: "",
    receiptNumber: generateReceiptNumber(),
    nextRentDueDate: "",
    purpose: "",
    landlordSignature: "",
    tenantSignature: "",
  });
  const [previewReceipt, setPreviewReceipt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const landlordSignaturePad = useRef<SignatureCanvas>(null);
  const tenantSignaturePad = useRef<SignatureCanvas>(null);

  function generateReceiptNumber() {
    return `REC-${Date.now().toString().slice(-6)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }

  function calculateNextRentDueDate(paymentDate: string | number | Date) {
    if (!paymentDate) return "";
    const date = new Date(paymentDate);
    date.setMonth(date.getMonth() + 1); // Adds one month
    return date.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
  }

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        console.log("Attempting to fetch data for paymentId:", paymentId); 
        setLoading(true);
        const response = await axios.get(
          `https://rental-management-backend.onrender.com/api/RentPayment/view/${paymentId}`, // Ensure this is the correct endpoint
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        console.log("Received data:", response.data); 
        const data = response.data;
        setReceiptData({
          tenantName: data.fullName,
          roomNumber: data.roomNumber,
          amountPaid: data.paymentAmount,
          paymentDate: data.paymentDate,
          receiptNumber: generateReceiptNumber(),
          nextRentDueDate: calculateNextRentDueDate(data.paymentDate),
          purpose: data.purpose,
          landlordSignature: "",
          tenantSignature: "",
        });
      } catch (err) {
        console.error(err); 
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (paymentId) {
      console.log("Valid paymentId, fetching data...");  
    fetchReceiptData();
  } else {
    setError("Invalid payment ID.");
  }
  }, [paymentId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReceiptData({ ...receiptData, [name]: value });
  };

  // Clear the landlord's signature
  const clearLandlordSignature = () => {
    landlordSignaturePad.current?.clear();
    setReceiptData({ ...receiptData, landlordSignature: "" });
  };

  // Clear the tenant's signature
  const clearTenantSignature = () => {
    tenantSignaturePad.current?.clear();
    setReceiptData({ ...receiptData, tenantSignature: "" });
  };

  // Generate the receipt
  const handleGenerateReceipt = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const landlordSignature =
      (landlordSignaturePad.current?.toDataURL() as string) ?? "";
    const tenantSignature =
      (tenantSignaturePad.current?.toDataURL() as string) ?? "";

         const response = await axios.post(
        "https://rental-management-backend.onrender.com/api/receipt/generate",
        { ...receiptData, landlordSignature, tenantSignature }
      );
      setSuccess("Receipt generated successfully!");
      setPreviewReceipt(true);
    } catch (err) {
      setError("Failed to generate receipt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    // Pointer logic inside useEffect
    useEffect(() => {
      const canvas = document.querySelector('.signature-canvas') as HTMLCanvasElement; 
      const pointer = document.createElement('div');
      pointer.classList.add('signature-pointer');
      canvas?.appendChild(pointer);
  
      const updatePointerPosition = (event: MouseEvent) => {
        const rect = canvas?.getBoundingClientRect();
        const x = event.clientX - (rect?.left ?? 0);
        const y = event.clientY - (rect?.top ?? 0);
  
        if (x >= 0 && x <= (rect?.width ?? 0) && y >= 0 && y <= (rect?.height ?? 0)) {
          pointer.style.left = `${x}px`;
          pointer.style.top = `${y}px`;
          pointer.style.display = 'block';
        } else {
          pointer.style.display = 'none';
        }
      };
  
      const hidePointerOnLeave = () => {
        pointer.style.display = 'none';
      };
  
      canvas?.addEventListener('mousemove', updatePointerPosition);
      canvas?.addEventListener('mouseleave', hidePointerOnLeave);
  
      return () => {
        canvas?.removeEventListener('mousemove', updatePointerPosition);
        canvas?.removeEventListener('mouseleave', hidePointerOnLeave);
      };
    }, []);

  return (
    <div className="receipt-container">
      <header className="receipt-header">
        <img src="your-logo.png" alt="Hostel Logo" className="logo" />
        <div className="header-details">
          <h1>IKOT AKPADEN HOSTEL</h1>
          <p>Address: Ikot Akpaden, Akwa Ibom, Nigeria</p>
          <p>Phone: +234-123-456-7890 | Email: info@ikotakpadenhostel.com</p>
        </div>
      </header>

      <h2 className="form-title">Generate Tenancy Payment Receipt</h2>
      <form className="receipt-form">
        {/* Tenant Information */}
        <div className="form-group">
          <label>Tenant Name:</label>
          <input
            type="text"
            name="tenantName"
            value={receiptData.tenantName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Room Number:</label>
          <input
            type="text"
            name="roomNumber"
            value={receiptData.roomNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount Paid (₦):</label>
          <input
            type="number"
            name="amountPaid"
            value={receiptData.amountPaid}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Payment Date:</label>
          <input
            type="date"
            name="paymentDate"
            value={receiptData.paymentDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Receipt Number:</label>
          <input
            type="text"
            name="receiptNumber"
            value={receiptData.receiptNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Next Rent Due Date:</label>
          <input
            type="date"
            name="nextRentDueDate"
            value={receiptData.nextRentDueDate}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Purpose/Description:</label>
          <textarea
            name="purpose"
            value={receiptData.purpose}
            onChange={handleChange}
            required
          />
        </div>

        {/* Landlord Signature */}
        <div className="form-group">
          <label>Landlord Signature:</label>
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: "signature-canvas" }}
            ref={landlordSignaturePad}
            onEnd={() =>
              setReceiptData({
                ...receiptData,
                landlordSignature: landlordSignaturePad.current?.toDataURL() ?? "",
              })
            }
            
          />
          <button type="button" onClick={clearLandlordSignature}>
            Clear Signature
          </button>
        </div>

        {/* Tenant Signature */}
        {/* Tenant Signature */}
        <div className="form-group">
          <label>Tenant Signature:</label>
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: "signature-canvas" }}
            ref={tenantSignaturePad}
            onEnd={() =>
              setReceiptData({
                ...receiptData,
                tenantSignature: tenantSignaturePad.current?.toDataURL() ?? "",
              })
            }
            
          />
          <button type="button" onClick={clearTenantSignature}>
            Clear Signature
          </button>
        </div>

        <button
          type="button"
          className="generate-btn"
          onClick={handleGenerateReceipt}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Receipt"}
        </button>
      </form>

      {/* Error or Success Messages */}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {/* Receipt Preview */}
      {previewReceipt && (
        <div className="receipt-preview">
          <header className="receipt-header-preview">
            <img src="your-logo.png" alt="Hostel Logo" className="logo" />
            <div className="header-details">
              <h2>IKOT AKPADEN HOSTEL</h2>
              <p>Official Payment Receipt</p>
            </div>
          </header>
          <div className="receipt-details">
            <p>
              <strong>Tenant Name:</strong> {receiptData.tenantName}
            </p>
            <p>
              <strong>Room Number:</strong> {receiptData.roomNumber}
            </p>
            <p>
              <strong>Amount Paid:</strong> ₦{receiptData.amountPaid}
            </p>
            <p>
              <strong>Payment Date:</strong> {receiptData.paymentDate}
            </p>
            <p>
              <strong>Next Rent Due Date:</strong> {receiptData.nextRentDueDate}
            </p>
            <p>
              <strong>Receipt Number:</strong> {receiptData.receiptNumber}
            </p>
            <p>
              <strong>Purpose:</strong> {receiptData.purpose}
            </p>
          </div>
          <div className="signatures">
            <div className="signature">
              <p>Landlord Signature:</p>
              {receiptData.landlordSignature && (
                <img
                  src={receiptData.landlordSignature}
                  alt="Landlord Signature"
                  className="signature-preview"
                />
              )}
            </div>
            <div className="signature">
              <p>Tenant Signature:</p>
              {receiptData.tenantSignature && (
                <img
                  src={receiptData.tenantSignature}
                  alt="Tenant Signature"
                  className="signature-preview"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenancyReceipt;
