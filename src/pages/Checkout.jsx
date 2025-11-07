import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(""); // ✅ baru
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer"); // ✅ baru
  const navigate = useNavigate();

  async function loadCart() {
    try {
      const data = await api.cart.getAll();
      setCartItems(data);
    } catch (err) {
      console.error("❌ Failed to load checkout items:", err);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  const total = selectedItems.reduce(
    (sum, item) => sum + item.quantity * (item.menu?.price || 0),
    0
  );

  function toggleSelect(item) {
    const exists = selectedItems.find((i) => i.id === item.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  }

  async function handleRemove(id) {
    try {
      await api.cart.removeItem(id);
      setCartItems(cartItems.filter((i) => i.id !== id));
      setSelectedItems(selectedItems.filter((i) => i.id !== id));
    } catch (err) {
      alert("❌ Gagal menghapus item");
      console.error(err);
    }
  }

  // ✅ Tambahkan alamat + metode pembayaran + simulasi bayar otomatis
  async function handleCheckout() {
    if (selectedItems.length === 0) {
      alert("⚠️ Pilih minimal 1 item untuk checkout!");
      return;
    }

    if (!address.trim()) {
      alert("⚠️ Masukkan alamat pengiriman terlebih dahulu!");
      return;
    }

    setLoading(true);
    try {
      const checkoutItems = selectedItems.map((item) => ({
        menuId: item.menuId || item.id,
        quantity: item.quantity || 1,
      }));

      const totalPrice = selectedItems.reduce(
        (sum, item) => sum + (item.menu?.price || 0) * (item.quantity || 1),
        0
      );

      const token = localStorage.getItem("token");

      // 🔹 1. Buat order baru
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: checkoutItems,
          totalPrice,
          address,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout gagal");

      const orderId = data.orderId;
      console.log("✅ Order berhasil dibuat:", orderId);

      // 🔹 2. Simulasi payment
      const payRes = await fetch(
        `http://localhost:3000/orders/${orderId}/pay`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payData = await payRes.json();
      if (!payRes.ok) throw new Error(payData.error || "Payment gagal");
      console.log("💳 Payment success:", payData);

      alert("✅ Pembayaran berhasil! Pesanan kamu sedang diproses.");
      navigate("/orders"); // arahkan ke halaman riwayat
    } catch (err) {
      alert("❌ Checkout gagal: " + err.message);
      console.error("Checkout Error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="container py-5"
      style={{
        background: "linear-gradient(135deg, #f8fafc, #e0f2fe)",
        minHeight: "100vh",
      }}
    >
      <h2 className="text-center fw-bold mb-4 text-primary">
        💳 Checkout Summary
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <p>Your cart is empty.</p>
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => navigate("/products")}
          >
            🔙 Back to Products
          </button>
        </div>
      ) : (
        <div className="card shadow border-0 p-4 rounded-4">
          <table className="table align-middle">
            <thead className="bg-light text-secondary rounded-top">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === cartItems.length &&
                      cartItems.length > 0
                    }
                    onChange={(e) =>
                      e.target.checked
                        ? setSelectedItems(cartItems)
                        : setSelectedItems([])
                    }
                  />
                </th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const isChecked = selectedItems.some((i) => i.id === item.id);
                return (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(item)}
                      />
                    </td>
                    <td className="fw-semibold">{item.menu?.name}</td>
                    <td>{item.menu?.menuCategory?.name || "-"}</td>
                    <td>Rp {item.menu?.price?.toLocaleString()}</td>
                    <td>{item.quantity}</td>
                    <td className="fw-bold text-primary">
                      Rp {(item.menu?.price * item.quantity).toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        onClick={() => handleRemove(item.id)}
                      >
                        🗑 Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="text-end mt-4">
            <h4 className="fw-bold">
              Total:{" "}
              <span className="text-primary">Rp {total.toLocaleString()}</span>
            </h4>

            {/* ✅ Tambahan minimalis: input alamat & metode pembayaran */}
            <div className="text-start mt-4 border-top pt-3">
              <label className="fw-semibold">Alamat Pengiriman:</label>
              <textarea
                className="form-control mt-2 mb-3"
                placeholder="Masukkan alamat lengkap..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <label className="fw-semibold">Metode Pembayaran:</label>
              <select
                className="form-select mt-2"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="COD">Cash on Delivery</option>
                <option value="E-Wallet">E-Wallet (Dana, OVO, Gopay)</option>
              </select>
            </div>

            <button
              className="btn btn-success mt-4 px-5 py-2 fw-semibold shadow-sm rounded-pill"
              onClick={handleCheckout}
              disabled={loading || selectedItems.length === 0}
            >
              {loading
                ? "Processing..."
                : `✅ Confirm & Pay (${selectedItems.length} items)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
