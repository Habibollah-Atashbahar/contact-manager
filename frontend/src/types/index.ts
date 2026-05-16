// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

// Contact Types
export interface Contact {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreateContactRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  description?: string;
}

// Response Types
export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    access_token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ContactListResponse {
  data: Contact[];
  total: number;
}

export interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  description: string;
}
