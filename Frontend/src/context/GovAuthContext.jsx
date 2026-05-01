import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const GovAuthContext = createContext(null);

export const GovAuthProvider = ({ children }) => {
  const [official, setOfficial] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const { data } = await API.get("/gov/me");
        setOfficial(data.official || null);
      } catch {
        setOfficial(null);
      } finally {
        setAuthLoading(false);
      }
    };
    bootstrapSession();
  }, []);

  const login = (officialData) => {
    setOfficial(officialData || null);
  };

  const logout = async () => {
    try {
      await API.post("/gov/logout");
    } catch {
      // Cookie cleanup still happens via state.
    }
    setOfficial(null);
  };

  return (
    <GovAuthContext.Provider
      value={{ official, login, logout, isAuthenticated: !!official, authLoading }}
    >
      {children}
    </GovAuthContext.Provider>
  );
};

export const useGovAuth = () => {
  const ctx = useContext(GovAuthContext);
  if (!ctx) throw new Error("useGovAuth must be used inside GovAuthProvider");
  return ctx;
};

export default GovAuthContext;
