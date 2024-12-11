import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<{ id: number; roomNumber: string; status: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roomStats, setRoomStats] = useState({ vacant: 0, occupied: 0, underMaintenance: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        // Fetch user profiles to get room numbers
        const userProfilesResponse = await fetch(
          "https://rental-management-backend.onrender.com/api/userProfiles"
        );
        const userProfilesData = await userProfilesResponse.json();
        if (Array.isArray(userProfilesData)) {
            const extractedRooms = userProfilesData.map((profile) => ({
              id: profile.profileId,
              roomNumber: profile.roomNumber,
              status: profile.roomStatus, 
    }));
    setRooms(extractedRooms);
    updateRoomStats(extractedRooms);
    } else {
        console.error("Expected an array but received:", userProfilesData);
      }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchUserProfiles();
  }, []);

  const updateRoomStats = (rooms: any[]) => {
    const stats = { vacant: 0, occupied: 0, underMaintenance: 0 };
    rooms.forEach((room: { status: string; }) => {
      if (room.status === "vacant") stats.vacant++;
      if (room.status === "occupied") stats.occupied++;
      if (room.status === "under maintenance") stats.underMaintenance++;
    });
    setRoomStats(stats);
  };

  const handleStatusChange = async (roomId: number, newStatus: string) => {
    try {
      await fetch(`https://rental-management-backend.onrender.com/api/userProfiles/${roomId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomStatus: newStatus }),
      });

      // Update the room locally
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomId ? { ...room, status: newStatus } : room
        )
      );

      // Update statistics
      updateRoomStats(rooms);
    } catch (error) {
      console.error("Error updating room status:", error);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const chartData = {
    labels: ["Vacant", "Occupied", "Under Maintenance"],
    datasets: [
      {
        label: "Room Status",
        data: [roomStats.vacant, roomStats.occupied, roomStats.underMaintenance],
        backgroundColor: ["#34D399", "#F87171", "#FBBF24"],
        borderColor: ["#10B981", "#EF4444", "#F59E0B"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Room Status Analytics",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return tooltipItem.raw + " rooms";
          },
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={handleBackToDashboard}
        className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
      >
        Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4">Room Management</h2>

      {isLoading ? (
        <p>Loading rooms...</p>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Total Rooms: {rooms.length}</h3>
            <Bar data={chartData} options={chartOptions} />
          </div>

          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Room Number</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="py-2 px-4 border-b">{room.roomNumber}</td>
                    <td className="py-2 px-4 border-b">{room.status}</td>
                    <td className="py-2 px-4 border-b">
                      <select
                        value={room.status}
                        onChange={(e) => handleStatusChange(room.id, e.target.value)}
                        className="border p-2 rounded"
                      >
                        <option value="vacant">Vacant</option>
                        <option value="occupied">Occupied</option>
                        <option value="under maintenance">Under Maintenance</option>
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default RoomManagement;
