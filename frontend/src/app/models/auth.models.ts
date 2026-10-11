export type Role = 'ROLE_CUSTOMER' | 'ROLE_RESTAURANT_OWNER' | 'ROLE_DELIVERY_PARTNER' | 'ROLE_ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  restaurantId?: number;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  fullName: string;
  role: Role;
  isVerified: boolean;
  restaurantId?: number;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
