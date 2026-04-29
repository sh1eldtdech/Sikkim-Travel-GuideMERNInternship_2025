import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const OwnerAuthContext = createContext(null);

export const OwnerAuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const bootstrapOwnerSession = async () => {
      try {
        const { data } = await API.get("/owner/me");
        setOwner(data.owner || null);
      } catch {
        setOwner(null);
      } finally {
        setAuthLoading(false);
      }
    };

    bootstrapOwnerSession();
  }, []);

  const login = (tokenOrOwnerData, maybeOwnerData) => {
    const ownerData = maybeOwnerData || tokenOrOwnerData || null;
    setOwner(ownerData);
  };

  const logout = async () => {
    try {
      await API.post("/owner/logout");
    } catch {
      // Cookie cleanup still happens on the client session state.
    }
    setOwner(null);
  };

  return (
    <OwnerAuthContext.Provider
      value={{ owner, login, logout, isAuthenticated: !!owner, authLoading }}
    >
      {children}
    </OwnerAuthContext.Provider>
  );
};

export const useOwnerAuth = () => {
  const ctx = useContext(OwnerAuthContext);
  if (!ctx)
    throw new Error("useOwnerAuth must be used inside OwnerAuthProvider");
  return ctx;
};

export default OwnerAuthContext;
