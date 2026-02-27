import { cookies } from 'next/headers';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  token: string;
}

// Mock user database - in production, this would be stored in a real database
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@quickhireprime.ae',
    role: 'admin',
    token: 'admin-token-' + Date.now()
  },
  {
    id: 2,
    name: 'Staff User',
    email: 'staff@quickhireprime.ae',
    role: 'staff',
    token: 'staff-token-' + Date.now()
  }
];

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // In a real application, you would hash passwords and verify against a database
  // For demo purposes, we'll use a simple check
  if (password === process.env.ADMIN_PASSWORD || password === 'admin123') {
    const user = mockUsers.find(u => u.email === email);
    return user || null;
  }

  return null;
};

export const getUserByToken = async (token: string): Promise<User | null> => {
  return mockUsers.find(u => u.token === token) || null;
};

export const isAdmin = (user: User): boolean => {
  return user.role === 'admin';
};

export const isStaff = (user: User): boolean => {
  return user.role === 'staff';
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return null;
    }

    return await getUserByToken(token);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};