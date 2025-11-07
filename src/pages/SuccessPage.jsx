import React from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #f9fafb, #e0f2fe)",
        minHeight: "100vh",
      }}
    >
      <div className="card shadow-lg border-0 rounded-4 p-5 text-center">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="90"
            height="90"
            fill="green"
            className="bi bi-check-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.08-.02l3.992-4.99a.75.75 0 1 0-1.14-.976L7.477 9.417 5.383 7.323a.75.75 0 0 0-1.06 1.06l2.647 2.647z" />
          </svg>
        </div>

        <h2 className="fw-bold text-success">Pembayaran Berhasil!</h2>
        <p className="text-secondary mt-3">
          Pesanan kamu sedang <span className="fw-semibold">diproses</span> oleh
          tim kami.
          <br />
          Kamu bisa melihat status pesanan di halaman{" "}
          <span className="fw-semibold">Riwayat Transaksi</span>.
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            className="btn btn-outline-primary px-4"
            onClick={() => navigate("/orders")}
          >
            📜 Lihat Riwayat
          </button>
          <button
            className="btn btn-primary px-4"
            onClick={() => navigate("/products")}
          >
            🍽️ Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
}
