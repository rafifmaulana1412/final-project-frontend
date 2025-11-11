import React, { createContext, useContext, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  async function login(email, password) {
    try {
      setLoading(true);
      const res = await api.auth.login(email, password);

      if (res?.token) {
        localStorage.setItem("token", res.token);
        setUser(res.user || { role: "customer" });
      }

      setLoading(false);
      return res;
    } catch (err) {
      console.error("❌ Login error:", err);
      setLoading(false);
      throw err;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
