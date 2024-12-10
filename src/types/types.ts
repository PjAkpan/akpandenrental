
// Define the interface for the login response
export interface LoginResponse {
    code?: number; 
    token: string;
    message: string;
    status: boolean;
    payload: {
      encryptedString: any;
      verificationToken: any;
      deviceId?: string; 
      access?: string;  
    };
  }
  
  export type Tenant = {
    id: number;
    name: string;
    roomNumber: number;
    contact: string;
    rentStatus: string; // Paid or Due
    leaseExpiryDate?: string;
  };