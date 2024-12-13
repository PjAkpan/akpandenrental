
// Define the interface for the login response
export interface LoginResponse {
    code?: number; 
    token: string;
    message: string;
    status: boolean;
    payload: {
      UserId: any;
      userId: any;
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

  export type MaintenanceRequest = {
    id: number;
    tenantName: string;
    issue: string;
    status: string;
    createdAt: string;
  };

  export interface Message {
    id: number;
    sender: string;
    content: string;
    timestamp: string;
    type: "text" | "file";
    edited?: boolean;
    isDeleted?: boolean;
  }

  export interface Payment {
    tenantName: string;
    amountPaid: number;
    paymentDate: string;
    paymentReceipt: string;
    tenancyReceipt: string;
    tenantEmail: string;
    tenantPhone: string;
  }

  export type AnalyticsData = {
    totalRooms: number;
    occupiedRooms: number;
    totalTenants: number;
    totalRevenue: number;
    outstandingPayments: number;
    maintenanceRequests: number;
  };

  export interface ProfileData {
    profileImage?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    homeAddress?: string;
    occupation?: string;
    roomNumber?: string | null;
  }

  export interface UserContextType {
    roles: string[] | null; 
    setUserRoles: (roles: string) => void; 
  }

  export interface ProtectedRouteProps {
    rolesRequired: string[];
  }