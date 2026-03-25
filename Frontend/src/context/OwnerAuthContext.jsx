import React, { createContext, useContext, useState, useEffect } from "react";

const OwnerAuthContext = createContext(null);

export const OwnerAuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(null);
  const [ownerToken, setOwnerToken] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("ownerToken");
    const ownerData = localStorage.getItem("ownerData");
    if (token && ownerData) {
      setOwnerToken(token);
      setOwner(JSON.parse(ownerData));
    }
  }, []);

  const login = (token, ownerData) => {
    localStorage.setItem("ownerToken", token);
    localStorage.setItem("ownerData", JSON.stringify(ownerData));
    setOwnerToken(token);
    setOwner(ownerData);
  };

  const logout = () => {
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("ownerData");
    setOwnerToken(null);
    setOwner(null);
  };

  return (
    <OwnerAuthContext.Provider value={{ owner, ownerToken, login, logout, isAuthenticated: !!ownerToken }}>
      {children}
    </OwnerAuthContext.Provider>
  );
};

export const useOwnerAuth = () => {
  const ctx = useContext(OwnerAuthContext);
  if (!ctx) throw new Error("useOwnerAuth must be used inside OwnerAuthProvider");
  return ctx;
};

export default OwnerAuthContext;
