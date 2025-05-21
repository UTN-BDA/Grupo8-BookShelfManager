import api from './api';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export const userService = {
  // Autenticación
  async login(credentials: LoginRequest): Promise<User> {
    const res = await api.post<User>('/users/login', credentials);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  },

  async register(userData: RegisterRequest): Promise<User> {
    const res = await api.post<User>('/users/register', userData);
    return res.data;
  },

  logout(): void {
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // CRUD operations
  async getAllUsers(): Promise<User[]> {
    const res = await api.get<User[]>('/users');
    return res.data;
  },

  async getUserById(id: string): Promise<User> {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  },

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const res = await api.put<User>(`/users/${id}`, userData);
    return res.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};
