import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await api.users.getAll();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.users.delete(id);
      loadUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div
      className="container mt-4 p-4 rounded shadow-sm"
      style={{
        background: "linear-gradient(135deg, #f8f9fa, #e3f2fd)",
        minHeight: "90vh",
      }}
    >
      <h3 className="fw-bold text-primary mb-4 text-center">
        👥 Customer Management
      </h3>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-3">Loading users...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle shadow-sm">
            <thead className="table-primary text-center">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Registered At</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {users.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td className="fw-semibold">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === "admin"
                          ? "bg-danger"
                          : u.role === "staff"
                          ? "bg-warning text-dark"
                          : u.role === "editor"
                          ? "bg-info text-dark"
                          : "bg-success"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user?.role === "admin" && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(u.id)}
                      >
                        🗑 Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
