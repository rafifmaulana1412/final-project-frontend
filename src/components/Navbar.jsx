import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import { FaBars } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* 🔘 Tombol toggle sidebar (muncul hanya kalau user sudah login) */}
        {user && (
          <button
            onClick={toggleSidebar}
            className="btn btn-outline-light me-2"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.2rem",
            }}
          >
            <FaBars />
          </button>
        )}

        {/* 🔖 Brand */}
        <Link className="navbar-brand fw-bold text-uppercase" to="/">
          Montevia Restaurant 💎
        </Link>

        {/* 🔗 Menu kanan */}
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav align-items-center mb-0">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button
                  onClick={logout}
                  className="btn btn-outline-light fw-semibold px-3 py-1"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
