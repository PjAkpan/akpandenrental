let websocketInstance = null;

export const initializeWebSocket = (url, onMessage) => {
  if (websocketInstance) {
    console.warn("WebSocket is already initialized.");
    return websocketInstance;
  }

  websocketInstance = new WebSocket(url);

  websocketInstance.onopen = () => {
    console.log("WebSocket connected");
  };

  websocketInstance.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  websocketInstance.onclose = () => {
    console.log("WebSocket disconnected. Attempting to reconnect...");
    websocketInstance = null; // Reset instance to allow reconnection
    setTimeout(() => initializeWebSocket(url, onMessage), 3000); // Reconnect after 3 seconds
  };

  // Safe check before calling close()
  websocketInstance.onerror = (error) => {
    console.error("WebSocket error:", error);
    if (websocketInstance) {
      websocketInstance.close();  // Close the connection only if it's initialized
    }
  };

  return websocketInstance;
};

export const closeWebSocket = () => {
  if (websocketInstance) {
    websocketInstance.close();
    websocketInstance = null;
    console.log("WebSocket connection closed.");
  }
};
