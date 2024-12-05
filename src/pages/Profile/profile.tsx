/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';  // Import icons from react-icons
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();  // Hook for programmatic navigation
  const [contactInfo, setContactInfo] = useState({
    fullName: 'John Doe',
    email: 'tenant@example.com',
    phoneNumber: '+1234567890',
  });
  const [editMode, setEditMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([
    { date: '2023-10-02', amount: '₦25,000', status: 'Paid' },
    { date: '2023-09-02', amount: '₦25,000', status: 'Paid' },
  ]);

  const [roomData, setRoomData] = useState({
    roomNumber: '12',
    dueDate: '5th of every month',
  });
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handlePhoneNumberChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setNewPhoneNumber(e.target.value);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setNewPhoneNumber(contactInfo.phoneNumber);
    setIsOtpSent(false); // Reset OTP state when toggling edit
  };

  const handleSendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/send-otp', { email: contactInfo.email });
      setIsOtpSent(true);
      alert('OTP has been sent to your email!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', { 
        email: contactInfo.email, 
        otp, 
        newPhoneNumber 
      });
      if (response.data.success) {
        setContactInfo((prev) => ({ ...prev, phoneNumber: newPhoneNumber }));
        setEditMode(false);
        alert('Phone number updated successfully!');
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Failed to verify OTP. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/change-password', { 
        oldPassword: password, 
        newPassword 
      });
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)} // Navigate back to the previous page
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <FaArrowLeft className="text-gray-700" size={20} />
          </button>
          <button
            onClick={() => navigate('/dashboard')} // Navigate to the dashboard
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <FaHome className="text-gray-700" size={20} />
          </button>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Profile</h2>

        {/* Contact Information Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-lg font-medium text-gray-600">Full Name</label>
              <input
                type="text"
                value={contactInfo.fullName}
                disabled
                className="mt-2 w-full p-3 border rounded-lg bg-gray-100 border-gray-200"
              />
            </div>
            <div>
              <label className="text-lg font-medium text-gray-600">Email</label>
              <input
                type="email"
                value={contactInfo.email}
                disabled
                className="mt-2 w-full p-3 border rounded-lg bg-gray-100 border-gray-200"
              />
            </div>
            <div>
              <label className="text-lg font-medium text-gray-600">Phone Number</label>
              <input
                type="tel"
                value={editMode ? newPhoneNumber : contactInfo.phoneNumber}
                onChange={handlePhoneNumberChange}
                disabled={!editMode}
                className={`mt-2 w-full p-3 border rounded-lg ${editMode ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'}`}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            {editMode ? (
              isOtpSent ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-2 w-full p-3 border rounded-lg"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Verify OTP
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSendOtp}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Send OTP
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </>
              )
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Edit Phone Number
              </button>
            )}
          </div>
        </div>

        {/* Room Details Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">Room Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-lg font-medium text-gray-600">Room Number</label>
              <input
                type="text"
                value={roomData.roomNumber}
                disabled
                className="mt-2 w-full p-3 border rounded-lg bg-gray-100 border-gray-200"
              />
            </div>
            <div>
              <label className="text-lg font-medium text-gray-600">Payment Due Date</label>
              <input
                type="text"
                value={roomData.dueDate}
                disabled
                className="mt-2 w-full p-3 border rounded-lg bg-gray-100 border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-lg font-medium text-gray-600">Current Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full p-3 border rounded-lg bg-gray-100 border-gray-200"
              />
            </div>
            <div>
              <label className="text-lg font-medium text-gray-600">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-2 w-full p-3 border rounded-lg bg-gray-100 border-gray-200"
              />
            </div>
            <div>
              <label className="text-lg font-medium text-gray-600">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-2 w-full p-3 border rounded-lg bg-gray-100 border-gray-200"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">Payment History</h3>
          <div className="space-y-4">
            {paymentHistory.map((payment, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="text-lg">{payment.date}</p>
                  <p className="text-sm text-gray-600">Amount: {payment.amount}</p>
                </div>
                <div>
                  <p className="text-lg font-medium">{payment.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
