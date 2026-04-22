import React, { createContext, useContext, useState, useEffect } from "react";

const BikeOwnerAuthContext = createContext(null);

export const BikeOwnerAuthProvider = ({ children }) => {
  const [bikeOwner, setBikeOwner] = useState(null);
  const [bikeOwnerToken, setBikeOwnerToken] = useState(null);

  // Load from localStorage on mount — uses separate keys from hotel owner
  useEffect(() => {
    const token = localStorage.getItem("bikeOwnerToken");
    const data = localStorage.getItem("bikeOwnerData");
    if (token && data) {
      setBikeOwnerToken(token);
      setBikeOwner(JSON.parse(data));
    }
  }, []);

  const login = (token, bikeOwnerData) => {
    localStorage.setItem("bikeOwnerToken", token);
    localStorage.setItem("bikeOwnerData", JSON.stringify(bikeOwnerData));
    setBikeOwnerToken(token);
    setBikeOwner(bikeOwnerData);
  };

  const logout = () => {
    localStorage.removeItem("bikeOwnerToken");
    localStorage.removeItem("bikeOwnerData");
    setBikeOwnerToken(null);
    setBikeOwner(null);
  };

  return (
    <BikeOwnerAuthContext.Provider
      value={{ bikeOwner, bikeOwnerToken, login, logout, isAuthenticated: !!bikeOwnerToken }}
    >
      {children}
    </BikeOwnerAuthContext.Provider>
  );
};

export const useBikeOwnerAuth = () => {
  const ctx = useContext(BikeOwnerAuthContext);
  if (!ctx) throw new Error("useBikeOwnerAuth must be used inside BikeOwnerAuthProvider");
  return ctx;
};

export default BikeOwnerAuthContext;
