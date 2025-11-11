import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const res = await api.auth.register({ ...form, role });

    setSuccess(`${role} registered successfully!`);
    setTimeout(() => navigate("/login"), 2000);
  } catch (err) {
    setError(err.message || "Registration failed");
  }
};


  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3b82f6, #6d28d9)",
      }}
    >
      <div
        className="card shadow-lg p-4 text-center"
        style={{
          width: "100%",
          maxWidth: "420px", // ✅ samain ukuran card login
          borderRadius: "18px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          className="d-flex justify-content-center align-items-center mb-3"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            margin: "0 auto",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
          }}
        >
          <span style={{ fontSize: "28px" }}>📝</span>
        </div>

        <h3 className="fw-bold text-primary mb-2">Register</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input
              className="form-control"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            className="btn btn-primary w-100 fw-semibold"
            style={{
              borderRadius: "8px",
              background: "linear-gradient(90deg, #2563eb, #7c3aed)",
              border: "none",
              padding: "10px",
            }}
          >
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-decoration-none text-primary fw-semibold"
            >
              Login
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}
