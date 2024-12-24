import { ReactNode } from "react";

// Define the interface for the login response
export interface LoginResponse {
    code?: number; 
    token: string;
    message: string;
    status: boolean;
    payload: {
      rentPaymentId: any;
      paymentId: any;
      roles: any;
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
    subject: string; 
    description: string;
    issue: string;
    status: string;
    createdAt: string;
    isActive: boolean; 
  files: {
    pictureProof?: string; 
    videoProof?: string; 
  }[]; 
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

  export interface Message {
    id: number;
    sender: string;
    content: string;
    timestamp: string;
    type: "text" | "file";
    edited?: boolean;
    isDeleted?: boolean;
  }

  export interface PaymentData {
    lastPayment: string;
    amountPaid: number;
  }

  export interface ModalProps {
    message: string;
    onClose: () => void;
  }
  
  export interface ProtectedRouteProps {
    rolesRequired: string[];  
    id?: string; 
  }

  export type PaymentHistory = {
    status: ReactNode;
    paymentDate: string | number | Date;
    nextRentDueDate: string | number | Date;
    id: string; 
    amount: number;
    date: string;
   
  };

  export interface RentDetails {
    paymentAmount: any;
    id: string;
    amount: number;
    status: string;
    isActive: string;
    nextRentDueDate: string;
  }
  
  export type RentPayment = {
    amount: ReactNode;
    description: ReactNode;
    id: number;
    userId: string;
    status: string;
    isActive: boolean;
    createdAt: string;
  };

  export interface Filters {
    [x: string]: any;
    gSearch: string;
    option: string;
    orderBy: string;
    sort: string;
    size: number;
    page: number;
    startDate: string;
    endDate: string;
  }
  

