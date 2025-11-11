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
      const token = res.token;

      if (token) {
        localStorage.setItem("token", token);
        setUser(res.user || { role: "customer" }); // fallback role
      }

      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false
