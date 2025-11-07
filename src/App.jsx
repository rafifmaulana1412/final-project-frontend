import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useSidebar } from "./context/SidebarContext";
import PrivateRoute from "./components/PrivateRoutes";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import SuccessPage from "./pages/SuccessPage";
import PageTransition from "./components/PageTransition";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { visible } = useSidebar();
  const { user } = useAuth();

  return (
    <>
      {/* ✅ Navbar fixed */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1050,
        }}
      >
        <Navbar />
      </div>

      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Area konten utama */}
      <div
        className="container-fluid d-flex justify-content-center align-items-start"
        style={{
          minHeight: "100vh",
          paddingTop: "80px",
          transition: "all 0.4s ease",
          // 👇 Saat sidebar muncul, konten geser dikit biar gak ketimpa
          marginLeft: visible ? "250px" : "0",
          width: visible ? "calc(100% - 250px)" : "100%", // ✅ konten tetap full tapi menyesuaikan sidebar
        }}
      >
        <div
          className="content-wrapper"
          style={{
            width: "100%",
            maxWidth: "1200px",
            transition: "all 0.4s ease",
          }}
        >
          <PageTransition>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* 🔒 Login & Register hanya muncul jika belum login */}
              <Route
                path="/login"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <Login />
                }
              />

              <Route
                path="/register"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <Register />
                }
              />

              {/* Dashboard per role */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute
                    roles={["admin", "staff", "editor", "customer"]}
                  >
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/categories"
                element={
                  <PrivateRoute roles={["admin", "staff", "editor"]}>
                    <Categories />
                  </PrivateRoute>
                }
              />

              <Route
                path="/products"
                element={
                  <PrivateRoute
                    roles={["admin", "staff", "editor", "customer"]}
                  >
                    <Products />
                  </PrivateRoute>
                }
              />

              {/* ✅ tambahan biar customer aman */}
              <Route
                path="/menus"
                element={
                  <PrivateRoute roles={["customer"]}>
                    <Products />
                  </PrivateRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <PrivateRoute roles={["customer"]}>
                    <Checkout />
                  </PrivateRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <PrivateRoute roles={["customer"]}>
                    <Checkout />
                  </PrivateRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <PrivateRoute roles={["admin", "staff", "customer"]}>
                    <Orders />
                  </PrivateRoute>
                }
              />

              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route
                path="/success"
                element={
                  <PrivateRoute roles={["customer"]}>
                    <SuccessPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </PageTransition>
        </div>
      </div>
    </>
  );
}
