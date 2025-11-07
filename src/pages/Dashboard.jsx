import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import axios from "axios";

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  async function loadOrders() {
    try {
      setLoading(true);
      let data = [];

      if (user?.role === "admin" || user?.role === "staff") {
        data = await api.orders.getAll();
      } else if (user?.role === "customer") {
        data = await api.orders.getAll();
      }
      console.log("🧩 [DEBUG] Orders response from API:", data); // <--- tambahkan ini

      // ✅ Pastikan parsing data apapun format respons dari backend
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else if (Array.isArray(data.data)) {
        setOrders(data.data);
      } else if (data?.length === 0) {
        setOrders([]);
      } else {
        console.warn("⚠️ Unexpected order response format:", data);
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  return (
    <div className="p-4">
      <div className="card shadow-sm p-4 bg-white mb-4">
        <h2 className="fw-bold text-primary mb-3">📊 Dashboard</h2>
        <p className="fs-5 mb-1">
          Welcome to MyRestaurant, <strong>{user?.name}</strong>!
        </p>
        <p className="text-muted">
          You are logged in as{" "}
          <span className="fw-semibold text-success">{user?.role}</span>
        </p>
      </div>

      {/* ✅ ADMIN & STAFF: Lihat semua order customer */}
      {(user?.role === "admin" || user?.role === "staff") && (
        <div className="card shadow-sm p-4 bg-light">
          <h4 className="fw-bold text-primary mb-3">🧾 Customer Orders</h4>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-3">Loading order data...</p>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-muted text-center mb-0">
              No orders have been placed yet.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead className="table-primary text-center">
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Menu</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {orders.map((o, i) => (
                    <tr key={o.id}>
                      <td>{i + 1}</td>
                      <td>{o.user?.name || "N/A"}</td>
                      <td>
                        {o.menus && o.menus.length > 0
                          ? o.menus.map((m, idx) => (
                              <div key={idx}>
                                {m.name}{" "}
                                <small className="text-muted">
                                  × {m.OrderMenu?.quantity || 1}
                                </small>
                              </div>
                            ))
                          : "N/A"}
                      </td>
                      <td>
                        {o.menus?.reduce(
                          (sum, m) => sum + (m.OrderMenu?.quantity || 0),
                          0
                        ) || 1}
                      </td>
                      <td>Rp {Number(o.totalPrice).toLocaleString()}</td>
                      <td>
                        {new Date(o.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedOrder(o)}
                        >
                          🔍 View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ✅ CUSTOMER: Lihat riwayat transaksi sendiri */}
      {user?.role === "customer" && (
        <div className="card shadow-sm p-4 bg-light">
          <h4 className="fw-bold text-primary mb-3">
            💳 My Transaction History
          </h4>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-muted mt-3">Loading your transactions...</p>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-muted text-center mb-0">
              You haven’t made any orders yet.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success text-center">
                  <tr>
                    <th>#</th>
                    <th>Menu</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {orders.map((o, i) => (
                    <tr key={o.id}>
                      <td>{i + 1}</td>
                      <td>
                        {o.menus?.length > 0
                          ? o.menus.map((menu, idx) => (
                              <div key={idx}>
                                {menu.name}{" "}
                                <small className="text-muted">
                                  × {menu.OrderMenu?.quantity || 1}
                                </small>
                              </div>
                            ))
                          : "N/A"}
                      </td>
                      <td>
                        {o.menus?.reduce(
                          (sum, m) => sum + (m.OrderMenu?.quantity || 0),
                          0
                        ) || 1}
                      </td>
                      <td className="fw-semibold text-success">
                        Rp {Number(o.totalPrice).toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            o.status === "completed"
                              ? "bg-success"
                              : o.status === "pending"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {o.status || "pending"}
                        </span>
                      </td>
                      <td>
                        {new Date(o.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ✅ Modal Detail Order */}
      {selectedOrder && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content shadow-lg rounded-4 border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">🧾 Order Details</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Customer:</strong> {selectedOrder.user?.name || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.user?.email || "N/A"}
                </p>
                <hr />
                <p>
                  <strong>Menu:</strong>{" "}
                  {selectedOrder.menus?.[0]?.name ||
                    selectedOrder.menu?.name ||
                    "N/A"}
                </p>
                <p>
                  <strong>Quantity:</strong>{" "}
                  {selectedOrder.menus?.[0]?.OrderMenu?.quantity ||
                    selectedOrder.quantity ||
                    1}
                </p>
                <p>
                  <strong>Total Price:</strong> Rp{" "}
                  {Number(selectedOrder.totalPrice).toLocaleString()}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
