import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/ApiPaths";

// Definisikan tipe user sesuai struktur yang dikembalikan dari API
interface User {
  id: number;
  name: string;
  email: string;
  token: string;
  // tambahkan properti lain jika ada
}

// Definisikan tipe konteks
interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (userData: User) => void;
  clearUser: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

// Props untuk provider
interface UserProviderProps {
  children: ReactNode;
}

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) return;

    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async (): Promise<void> => {
      try {
        const response = await axiosInstance.get<User>(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (err) {
        console.error(`User not authenticated`, err);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}
