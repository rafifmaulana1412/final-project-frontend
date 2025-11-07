import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function loadCart() {
    try {
      const data = await api.cart.get();
      setCart(data);
    } catch (err) {
      console.error("❌ Failed to load cart:", err);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function handleRemove(id) {
    try {
      await api.cart.removeItem(id);
      loadCart();
    } catch (err) {
      console.error("❌ Failed to remove item:", err);
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * (item.menu?.price || 0),
    0
  );

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4 text-primary">🛒 Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <div className="card shadow border-0 p-4">
          <table className="table align-middle">
            <thead>
              <tr className="text-secondary">
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.menu?.name}</td>
                  <td>{item.quantity}</td>
                  <td>Rp {item.menu?.price?.toLocaleString()}</td>
                  <td>
                    <strong>
                      Rp {(item.quantity * item.menu?.price).toLocaleString()}
                    </strong>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-end mt-4">
            <h5 className="fw-semibold text-dark">
              Total:{" "}
              <span className="text-primary">Rp {total.toLocaleString()}</span>
            </h5>
            <button
              className="btn btn-primary mt-3 px-4 py-2 fw-semibold"
              onClick={() => navigate("/checkout")}
            >
              🚀 Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
