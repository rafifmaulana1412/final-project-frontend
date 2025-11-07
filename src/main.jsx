import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";
import { CartProvider } from "./context/CartContext"; // ✅ Tambah ini

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider>
          <CartProvider>
            {" "}
            <App />
          </CartProvider>
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
