import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const incomingUserId = params.get("userId");
    if (incomingUserId) {
      setUserId(incomingUserId);
    }
  }, [location.search]);

  const value = useMemo(
    () => ({
      userId,
      setUserId: (nextUserId) => {
        setUserId(nextUserId);
      }
    }),
    [userId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
};
