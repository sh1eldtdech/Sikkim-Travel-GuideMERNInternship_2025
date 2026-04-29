import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const BikeOwnerAuthContext = createContext(null);

export const BikeOwnerAuthProvider = ({ children }) => {
  const [bikeOwner, setBikeOwner] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const bootstrapBikeOwnerSession = async () => {
      try {
        const { data } = await API.get("/bike-owner/me");
        setBikeOwner(data.bikeOwner || null);
      } catch {
        setBikeOwner(null);
      } finally {
        setAuthLoading(false);
      }
    };

    bootstrapBikeOwnerSession();
  }, []);

  const login = (tokenOrOwnerData, maybeOwnerData) => {
    const bikeOwnerData = maybeOwnerData || tokenOrOwnerData || null;
    setBikeOwner(bikeOwnerData);
  };

  const logout = async () => {
    try {
      await API.post("/bike-owner/logout");
    } catch {
      // Cookie cleanup still happens on the client session state.
    }
    setBikeOwner(null);
  };

  return (
    <BikeOwnerAuthContext.Provider
      value={{
        bikeOwner,
        login,
        logout,
        isAuthenticated: !!bikeOwner,
        authLoading,
      }}
    >
      {children}
    </BikeOwnerAuthContext.Provider>
  );
};

export const useBikeOwnerAuth = () => {
  const ctx = useContext(BikeOwnerAuthContext);
  if (!ctx)
    throw new Error(
      "useBikeOwnerAuth must be used inside BikeOwnerAuthProvider",
    );
  return ctx;
};

export default BikeOwnerAuthContext;
