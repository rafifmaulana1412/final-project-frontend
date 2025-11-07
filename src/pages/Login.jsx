import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await login(form.email, form.password);
      if (res?.success) {
        const role = res?.user?.role;
        if (role === "admin") navigate("/dashboard");
        else if (role === "staff") navigate("/dashboard");
        else if (role === "editor") navigate("/dashboard");
        else navigate("/dashboard");
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError("Terjadi kesalahan saat login.");
    }
  }

  return (
    <div className="auth-bg">
      <div
        className="card shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: "60px",
              height: "60px",
              fontSize: "28px",
              background: "linear-gradient(135deg, #0d6efd, #6610f2)",
              boxShadow: "0 4px 10px rgba(13,110,253,0.3)",
            }}
          >
            🔐
          </div>
          <h2 className="fw-bold text-primary">Welcome Back</h2>
          <p className="text-muted mb-0">Login to your account</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              className="form-control form-control-lg"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              className="form-control form-control-lg"
              placeholder="Enter your password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
            style={{
              borderRadius: "10px",
              background: "linear-gradient(90deg, #0d6efd, #6f42c1)",
              border: "none",
            }}
            disabled={loading}
          >
            {loading ? "⏳ Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-primary fw-semibold text-decoration-none"
            >
              Register
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}
