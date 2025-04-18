import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoggedIn: boolean;
  firstName: string | null;
  lastName: string | null;
  setUserInfo: (firstName: string | null, lastName: string | null) => void;
  clearUserInfo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState(() => localStorage.getItem("token"));
  const [firstName, setFirstName] = useState(() =>
    localStorage.getItem("firstName")
  );
  const [lastName, setLastName] = useState(() =>
    localStorage.getItem("lastName")
  );

  // set token state
  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setTokenState(newToken);
  };

  const setUserInfo = (firstName: string | null, lastName: string | null) => {
    localStorage.setItem("firstName", firstName || "");
    localStorage.setItem("lastName", lastName || "");
    setFirstName(firstName);
    setLastName(lastName);
  };

  const clearUserInfo = () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    setFirstName(null);
    setLastName(null);
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isLoggedIn,
        firstName,
        lastName,
        setUserInfo,
        clearUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};