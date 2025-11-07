import React, { createContext, useState, useContext } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  async function login(email, password) {
    try {
      // ✅ FIX: sebelumnya pakai api.post("/auth/login")
      const data = await api.auth.login({ email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      console.error("❌ Login failed:", err);
      throw err;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
