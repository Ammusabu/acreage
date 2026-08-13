'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'guest' | 'host';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isGuest: boolean;
  isHost: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users
const DEMO_USERS = [
  { id: 6, name: 'Guest', email: 'guest@example.com', password: 'password', role: 'guest' as const },
  { id: 7, name: 'Guest2', email: 'bob@example.com', password: 'password', role: 'guest' as const },
  { id: 1, name: 'Host', email: 'host@example.com', password: 'password', role: 'host' as const },
  { id: 2, name: 'Host2', email: 'michael@example.com', password: 'password', role: 'host' as const },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('acreage_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('acreage_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Find user with matching credentials
    const foundUser = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
      setUser(userData);
      localStorage.setItem('acreage_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('acreage_user');
  };

  const isGuest = user?.role === 'guest';
  const isHost = user?.role === 'host';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isGuest, isHost, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
