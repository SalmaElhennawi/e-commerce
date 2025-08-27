export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name :string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    
  };
}