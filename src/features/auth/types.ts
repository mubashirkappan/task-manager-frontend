export type UserRole = 'admin' | 'user';

export interface User {
  id: string; // UUID
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}