import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

export default function Dashboard() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // NEW: Search & Date Filter
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // NEW: Delete order
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function loadOrders() {
    try {
      setLoading(true);
      let data = await api.orders.getAll();

      let arr = [];
      if (Array.isArray(data)) arr = data;
      else if (Array.isArray(data.orders)) arr = data.orders;
      else if (Array.isArray(data.data)) arr = data.data;

      setOrders(arr);
      setFilteredOrders(arr);
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  }

  // ========== FILTERING ===========
  useEffect(() => {
    let filtered = [...orders];

    // 🔍 SEARCH by customer name / email
    if (search.trim() !== "") {
      filtered = filtered.filter((o) =>
        (o.user?.name + o.user?.email)
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // 📅 DATE RANGE filter (frontend only)
    if (startDate) {
      filtered = filtered.filter(
        (o) => new Date(o.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (o) => new Date(o.createdAt) <= new Date(endDate + "T23:59:59")
      );
    }

    setFilteredOrders(filtered);
  }, [search, startDate, endDate, orders]);

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  return (
    <div className="p-4">

      {/* ==== HEADER ==== */}
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

      {/* ============= ADMIN & STAFF ================ */}
      {(user?.role === "admin" || user?.role === "staff") && (
        <div className="card shadow-sm p-4 bg-light">

          <h4 className="fw-bold text-primary mb-3">🧾 Customer Orders</h4>

          {/* 🔍 SEARCH */}
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Search customer name/email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* 📅 Date filters */}
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-secondary w-100"
                onClick={() => {
                  setSearch("");
                  setStartDate("");
                  setEndDate("");
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <p className="text-muted text-center">No matching orders.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead className="table-primary text-center">
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Menus</th>
                    <th>Qty</th>
                    <th>Total Price</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody className="text-center">
                  {filteredOrders.map((o, i) => (
                    <tr key={o.id}>
                      <td>{i + 1}</td>
                      <td>{o.user?.name}</td>

                      <td>
                        {o.menus?.map((m, idx) => (
                          <div key={idx}>
                            {m.name} × {m.OrderMenu?.quantity}
                          </div>
                        ))}
                      </td>

                      <td>
                        {o.menus?.reduce(
                          (sum, m) => sum + (m.OrderMenu?.quantity || 0),
                          0
                        )}
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
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => setSelectedOrder(o)}
                        >
                          🔍 View
                        </button>

                        {/* DELETE Button */}
                        {user?.role === "admin" && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setDeleteTarget(o);
                              setDeleteModal(true);
                            }}
                          >
                            🗑️ Delete
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
      )}

      {/* ============= CUSTOMER VIEW =============== */}
      {user?.role === "customer" && (
        <div className="card shadow-sm p-4 bg-light">

          <h4 className="fw-bold text-primary mb-3">💳 My Transaction History</h4>

          {/* DATE FILTERS */}
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-secondary w-100"
                onClick={() => {
                  setSearch("");
                  setStartDate("");
                  setEndDate("");
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <p className="text-muted text-center">No transactions.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success text-center">
                  <tr>
                    <th>#</th>
                    <th>Menu</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody className="text-center">
                  {filteredOrders.map((o, i) => (
                    <tr key={o.id}>
                      <td>{i + 1}</td>

                      <td>
                        {o.menus?.map((m, idx) => (
                          <div key={idx}>
                            {m.name} × {m.OrderMenu?.quantity}
                          </div>
                        ))}
                      </td>

                      <td>
                        {o.menus?.reduce(
                          (sum, m) => sum + (m.OrderMenu?.quantity || 0),
                          0
                        )}
                      </td>

                      <td className="fw-bold text-success">
                        Rp {Number(o.totalPrice).toLocaleString()}
                      </td>

                      <td>
                        <span className="badge bg-info">{o.status}</span>
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

      {/* ============= VIEW ORDER MODAL ============= */}
      {selectedOrder && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-4">

              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">🧾 Order Details</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>

              <div className="modal-body">

                <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email}</p>

                <hr />

                <strong className="d-block mb-2">Menus:</strong>
                <ul>
                  {selectedOrder.menus?.map((m, idx) => (
                    <li key={idx}>
                      {m.name} × {m.OrderMenu?.quantity}
                    </li>
                  ))}
                </ul>

                <p>
                  <strong>Total Qty:</strong>{" "}
                  {selectedOrder.menus?.reduce(
                    (sum, m) => sum + (m.OrderMenu?.quantity || 0),
                    0
                  )}
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

      {/* ============= DELETE ORDER CONFIRM MODAL ============= */}
      {deleteModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
          }}
          onClick={() => setDeleteModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-4">

              <h4 className="fw-bold text-danger mb-3">Confirm Delete</h4>

              <p>
                Delete order from{" "}
                <strong>{deleteTarget?.user?.name}</strong>?
              </p>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    await api.orders.delete(deleteTarget.id);
                    setDeleteModal(false);
                    loadOrders();
                  }}
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
