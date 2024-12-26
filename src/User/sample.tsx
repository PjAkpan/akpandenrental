import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { userRole, setUserRole } = useUserContext();
 const navigate = useNavigate();
  // Update role dynamically for testing (optional)
  const handleRoleChange = (role: string) => {
    setUserRole(role);
  };

  // Function to render the Customer Menu
  const renderCustomerMenu = () => {
    return (
      <div className="customer-menu">
        <h2>Customer Menu</h2>
        <ul>
          <li>View Profile</li>
          <li>View Payment History</li>
          <li>Submit Maintenance Request</li>
        </ul>
      </div>
    );
  };

  // Function to render the Admin Menu
  const renderAdminMenu = () => {
    return (
      <div className="admin-menu">
        <h2>Admin Menu</h2>
        <ul>
          <li>Manage Users</li>
          <li>View Reports</li>
          <li>Handle Maintenance Requests</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to the Dashboard</h1>
        <p>Current Role: {userRole}</p>
        <div className="role-buttons">
          <button onClick={() => handleRoleChange("Customer")}>Set to Customer</button>
          <button onClick={() => handleRoleChange("Admin")}>Set to Admin</button>
        </div>
      </header>

      {/* Render menus conditionally based on userRole */}
      <main className="dashboard-main">
        {userRole === "Customer" && renderCustomerMenu()}
        {userRole === "Admin" && renderAdminMenu()}
      </main>
    </div>
  );
};

export default Dashboard;
function useUserContext(): { userRole: any; setUserRole: any; } {
  throw new Error("Function not implemented.");
}

const handleBackToDashboard = () => {
  // navigate("/dashboard");
};

<button
onClick={handleBackToDashboard}
className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
>
Back to Dashboard
</button>


         {/* <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Room Number</th>
            <th className="px-4 py-2">Contact</th>
            <th className="px-4 py-2">Rent Status</th>
            <th className="px-4 py-2">Lease Expiry</th>
            <th className="px-4 py-2">Actions</th> */}

                   {/* <tbody>
        {filteredUserProfiles.map((userProfile) => (
                <tr key={userProfile.id} className="border-t">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedUserProfiles.includes(userProfile.id)}
                  onChange={() => toggleSelectUserProfile(userProfile.id)}
                />
              </td>
              <td className="px-4 py-2">{userProfile.fullName}</td>
              <td className="px-4 py-2">{userProfile.roomNumber}</td>
              <td className="px-4 py-2">{userProfile.contact}</td>
              <td
                className={`px-4 py-2 ${
                  userProfile.rentStatus === "Paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {userProfile.rentStatus}
              </td>
              <td className="px-4 py-2">
                {userProfile.leaseExpiryDate && (
                  <span
                    className={`${
                      new Date(userProfile.leaseExpiryDate).getTime() - Date.now() <=
                      30 * 24 * 60 * 60 * 1000
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {new Date(userProfile.leaseExpiryDate).toLocaleDateString()}
                  </span>
                )}
              </td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleEditUserProfile(userProfile)}
                >
                  <FiEdit />
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDeleteUserProfile(userProfile.id)}
                >
                  <FiTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody> */}