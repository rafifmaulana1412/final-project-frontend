import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
                  <th>Menu</th> {/* ✅ tambahkan kolom Menu */}
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Tidak ada order
                    </td>
                  </tr>
                ) : (
                  orders.map((o, i) => (
                    <tr key={o.id || i}>
                      <td>{i + 1}</td>
                      <td>{o.user?.name || "Unknown"}</td>
                      <td>{o.menus?.length || 0}</td>{" "}
                      {/* ✅ diganti dari items → menus */}
                      <td>
                        {/* ✅ tampilkan daftar nama menu */}
                        {o.menus?.map((m) => m.name).join(", ") || "N/A"}
                      </td>
                      <td>{o.status || "Pending"}</td>
                      <td>{new Date(o.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
