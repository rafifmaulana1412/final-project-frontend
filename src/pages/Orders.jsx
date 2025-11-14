import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // NEW STATES
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await api.orders.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  // 📌 LOAD ORDER DETAIL (NEW)
  async function viewDetail(id) {
    try {
      setDetailLoading(true);
      const data = await api.orders.getById(id);
      setSelectedOrder(data);
    } catch (err) {
      console.error("❌ Failed to fetch order detail:", err);
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div>
      <h3>All Orders</h3>
      <p>
        Logged in as:{" "}
        <strong>
          {user?.name} ({user?.role})
        </strong>
      </p>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Daftar Order</h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Total Items</th>
                  <th>Menu</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Action</th> {/* NEW */}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Tidak ada order
                    </td>
                  </tr>
                ) : (
                  orders.map((o, i) => (
                    <tr key={o.id || i}>
                      <td>{i + 1}</td>
                      <td>{o.user?.name || "Unknown"}</td>
                      <td>{o.menus?.reduce((a, b) => a + (b.OrderMenu?.quantity || 0), 0)}</td>
                      <td>{o.menus?.map((m) => m.name).join(", ") || "N/A"}</td>
                      <td>{o.status || "Pending"}</td>
                      <td>{new Date(o.createdAt).toLocaleString()}</td>

                      {/* VIEW BUTTON */}
                      <td>
                        <button
                          onClick={() => viewDetail(o.id)}
                          className="btn btn-sm btn-primary"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================
          ORDER DETAIL MODAL
      ========================== */}
      {selectedOrder && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">

              <h4 className="mb-3">Order Details</h4>

              {detailLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email}</p>

                  <hr />

                  <strong>Menu Items:</strong>
                  <ul>
                    {selectedOrder.menus?.map((m, idx) => (
                      <li key={idx}>
                        {m.name} × {m.OrderMenu?.quantity}
                      </li>
                    ))}
                  </ul>

                  <p>
                    <strong>Total Quantity:</strong>{" "}
                    {selectedOrder.menus?.reduce(
                      (sum, item) => sum + (item.OrderMenu?.quantity || 0),
                      0
                    )}
                  </p>

                  <p><strong>Total Price:</strong> Rp {selectedOrder.totalPrice?.toLocaleString()}</p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>

                  <button
                    className="btn btn-secondary mt-3"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
