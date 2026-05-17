import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser as apiGetCurrentUser, loginUser as apiLoginUser, registerUser as apiRegisterUser } from "../pages/Login/Hotels/api";

const UserAuthContext = createContext();

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      const response = await apiGetCurrentUser();
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear cookies
      await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await apiLoginUser(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiRegisterUser(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    authLoading,
    checkAuth,
    logout,
    login,
    register,
  };

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
};