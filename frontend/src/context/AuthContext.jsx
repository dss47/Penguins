import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        return { user: JSON.parse(savedUser), token: savedToken, loading: true };
      } catch {
        return { user: null, token: null, loading: false };
      }
    }
    if (savedToken) {
      return { user: null, token: savedToken, loading: true };
    }
    return { user: null, token: null, loading: false };
  });

  useEffect(() => {
    if (!state.token) return;

    api.get("/user/profile")
      .then((res) => {
        setState((prev) => ({ ...prev, user: res.data, loading: false }));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setState({ user: null, token: null, loading: false });
      });
  }, []);

  const login = useCallback((data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setState({ user: data.user, token: data.token, loading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setState({ user: null, token: null, loading: false });
    window.location.href = "/Auth";
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    login,
    logout,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === "admin",
    isManager: state.user?.role === "manager",
    role: state.user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
