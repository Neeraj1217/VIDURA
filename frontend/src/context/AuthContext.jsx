import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const STORAGE_KEY = "vidura_user_id";

const readStoredUserId = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
};

const persistUserId = (nextUserId) => {
  try {
    if (nextUserId) {
      localStorage.setItem(STORAGE_KEY, nextUserId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors (private browsing, quota, etc.)
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userId, setUserIdState] = useState(readStoredUserId);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const incomingUserId = params.get("userId");
    if (!incomingUserId) {
      return;
    }

    setUserIdState(incomingUserId);
    persistUserId(incomingUserId);

    params.delete("userId");
    const nextSearch = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : ""
      },
      { replace: true }
    );
  }, [location.pathname, location.search, navigate]);

  const value = useMemo(
    () => ({
      userId,
      setUserId: (nextUserId) => {
        setUserIdState(nextUserId);
        persistUserId(nextUserId);
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
