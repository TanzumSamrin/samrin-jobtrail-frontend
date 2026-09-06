import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access")
  );

  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh")
  );

  const [username, setUsername] = useState(
    localStorage.getItem("username")
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAccessToken = localStorage.getItem("access");
    const savedRefreshToken = localStorage.getItem("refresh");
    const savedUsername = localStorage.getItem("username");

    setAccessToken(savedAccessToken);
    setRefreshToken(savedRefreshToken);
    setUsername(savedUsername);

    setLoading(false);
  }, []);

  const login = (access, refresh, user) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("username", user);

    setAccessToken(access);
    setRefreshToken(refresh);
    setUsername(user);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");

    setAccessToken(null);
    setRefreshToken(null);
    setUsername(null);
  };

  const isAuthenticated = Boolean(accessToken);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        username,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}