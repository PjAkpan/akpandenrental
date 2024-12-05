// Define the shape of the request payload
export type SignupPayload = {
  email: string;
  fullName: string;
  password: string;
  password2: string;
  roomNumber: string | number;
  phoneNumber: string;
  deviceId: string;
};

// Define the shape of the response data
export type SignupResponse = {
  success: boolean;
  message: string;
  data?: any; // Adjust this type based on your API response
};

// Define the shape of the error response (if any)
export type ErrorResponse = {
  response: {
    data: {
      message: string;
    };
  };
  message?: string;
};
