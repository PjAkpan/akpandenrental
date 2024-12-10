import { v4 as uuidv4 } from "uuid";

export const getGeneralDeviceId = async () => {
  try {
    // Check for an existing device ID in localStorage
    let deviceId = localStorage.getItem("deviceId");

    if (!deviceId || typeof deviceId !== "string") {
      // Generate a new unique identifier
      deviceId = uuidv4();

      // Save the new device ID
      localStorage.setItem("deviceId", deviceId);
    }

    return deviceId;
  } catch (error) {
    console.error("Error generating device ID:", error);
    return null; // Fallback in case of error
  }
};
