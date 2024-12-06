import React from "react";


const Dashboard: React.FC = () => {
  const { userRole, setUserRole } = useUserContext();

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

