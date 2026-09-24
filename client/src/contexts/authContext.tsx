"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dob: string;
  bio?: string | null;
  secondEmail?: string | null;
  profilePicUrl?: string | null;
  isAdmin: boolean;
  isAgent: boolean;
  role: "ADMIN" | "MODERATOR" | "VIEWER";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<User | null>;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dob: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "http://localhost:5000/api/v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async (): Promise<User | null> => {
    try {
      //Check if /auth/me endpoint exists
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
        cache: "no-store"
      });

      if (response.ok) {
        const data = await response.json();
        const userData: User = data.user || data;

        setUser(userData);
        return userData;
      }

      if (response.status === 404) {
        //If endpoint doesn't exist, skip auth check
        console.warn("Auth check endpoint not available");
      }

      setUser(null);
      return null;
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  //Check if user is logged in on mount
  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string, redirectTo?: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    //Fetch user data after successful login
    const user = await checkAuth();

    if (user) {
      toast.success(`You have successfully logged in, ${user.firstName}!`);
    }

    //Redirect to the intended page or default to dashboard
    router.push(redirectTo || "/");
  };

  const register = async (userData: RegisterData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || "Registration failed!") as Error & {
        errors?: unknown;
      };

      if (data.errors) {
        error.errors = data.errors;
      }

      throw error;
    }

    //After registration, login to get user data
    await login(userData.email, userData.password);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });

      setUser(null);
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);

      //Still clear user locally even if request fails
      setUser(null);
      toast.success("Logged out successfully!");
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser: checkAuth,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
