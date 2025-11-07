import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext"; // ✅ tambahkan ini

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth(); // ✅ ambil data user login (role, token, dll)

  async function loadCartCount() {
    try {
      // ✅ hanya customer yang boleh load cart
      if (user?.role !== "customer") {
        setCartCount(0);
        return;
      }

      const data = await api.cart.getAll();
      setCartCount(data.length || 0);
    } catch (err) {
      console.error("❌ Gagal memuat jumlah cart:", err);
    }
  }

  useEffect(() => {
    loadCartCount();
  }, [user]); // reload setiap kali user berubah

  function incrementCart() {
    setCartCount((prev) => prev + 1);
  }

  function decrementCart() {
    setCartCount((prev) => Math.max(prev - 1, 0));
  }

  const value = {
    cartCount,
    setCartCount,
    incrementCart,
    decrementCart,
    refreshCart: loadCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
