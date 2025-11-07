import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaFileInvoiceDollar,
  FaUsers,
  FaUtensils,
  FaShoppingCart,
} from "react-icons/fa";

export default function Sidebar() {
  const { user } = useAuth();
  const { visible } = useSidebar();

  // Sidebar show/hide dengan animasi
  return (
    <div
      className="bg-dark text-white position-fixed top-0 start-0 vh-100 d-flex flex-column justify-content-between shadow"
      style={{
        width: "250px",
        transform: visible ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.4s ease",
        zIndex: 1040,
      }}
    >
      {/* Logo */}
      <div className="p-3 border-bottom">
        <h4 className="fw-bold text-uppercase text-white mb-0">MYRESTAURANT</h4>
      </div>

      {/* Menu Items */}
      <div className="flex-grow-1 p-3">
        <ul className="nav flex-column">
          {/* Admin / Staff / Editor */}
          {(user?.role === "admin" ||
            user?.role === "staff" ||
            user?.role === "editor") && (
            <>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/dashboard">
                  <FaTachometerAlt className="me-2" />
                  Dashboard
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/categories">
                  <FaTags className="me-2" />
                  Categories
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/products">
                  <FaBoxOpen className="me-2" />
                  Products
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/orders">
                  <FaFileInvoiceDollar className="me-2" />
                  Orders
                </Link>
              </li>
              {user?.role === "admin" && (
                <li className="nav-item mb-2">
                  <Link className="nav-link text-white" to="/users">
                    <FaUsers className="me-2" />
                    Users
                  </Link>
                </li>
              )}
            </>
          )}

          {/* Customer */}
          {user?.role === "customer" && (
            <>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/dashboard">
                  <FaTachometerAlt className="me-2" />
                  Dashboard
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/menus">
                  <FaUtensils className="me-2" />
                  Menu
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/cart">
                  <FaShoppingCart className="me-2" />
                  Cart
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link className="nav-link text-white" to="/orders">
                  <FaFileInvoiceDollar className="me-2" />
                  My Orders
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
