import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOTP: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState("");

  const email = state?.email || localStorage.getItem("email");
  const referenceId = state?.referenceId || localStorage.getItem("referenceId");

  useEffect(() => {
    if (!email || !referenceId) {
      navigate("/signup");
    } else {
      localStorage.setItem("email", email);
      localStorage.setItem("referenceId", referenceId);
    }
  }, [email, referenceId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error

    if (verifyLoading || !otp || otp.length < 4) {
      setError("Please enter a valid OTP.");
      return;
    }

    setVerifyLoading(true);

    try {
      const response = await axios.post("https://rental-management-backend.onrender.com/api/otp/verify", {
        otp,
        referenceId,
      });

      console.log("OTP verification response:", response.data);

      if (response.status === 200 && response.data.message === "OTP verified successfully.") {
        localStorage.removeItem("email");
        localStorage.removeItem("referenceId");
        navigate("/login");
      } else {
        setError(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Error verifying OTP."
          : "Network error. Please check your connection."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (loading || !email || !referenceId) return;

    setLoading(true);
    try {
      const response = await axios.post("https://rental-management-backend.onrender.com/api/otp/resend", {
        email,
        referenceId,
      });

      console.log("Resend OTP response:", response.data);

      if (response.data.success) {
        setResendStatus("OTP has been resent to your email!");
        setError("");
      } else {
        setResendStatus("");
        setError(response.data.message || "Error resending OTP.");
      }
    } catch (err) {
      setResendStatus("");
      setError("Error resending OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-8">
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-purple-500 rounded-full blur-lg opacity-50"></div>
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-indigo-500 rounded-full blur-lg opacity-50"></div>

        <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-4">
          OTP Verification
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter the OTP sent to your email to verify your account.
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4 font-semibold animate-pulse">
            {error}
          </p>
        )}
        {resendStatus && (
          <p className="text-green-500 text-center mb-4 font-semibold">
            {resendStatus}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-full text-white font-semibold bg-indigo-500 hover:bg-indigo-600 shadow-md focus:outline-none ${
              verifyLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={verifyLoading}
          >
            {verifyLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResendOTP}
            className={`text-indigo-500 hover:underline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
