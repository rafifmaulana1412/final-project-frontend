// src/api/api.js
import axios from "axios";

const API_URL = "https://cautious-dollop-v677796g5gxpfpx57-3000.app.github.dev"; // ✅ arahkan ke port backend kamu

function getToken() {
  return localStorage.getItem("token");
}

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData.error ||
      errorData.message ||
      `HTTP error! Status: ${res.status}`;
    throw new Error(message);
  }
  return res.json();
}

// 🔹 Generic request methods pakai fetch (biar gak ubah struktur)
async function get(endpoint, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(`${API_URL}${endpoint}`, { headers });
  return handleResponse(res);
}

async function post(endpoint, body = {}, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

async function put(endpoint, body = {}, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

async function del(endpoint, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers,
  });
  return handleResponse(res);
}

// 🔹 Tambahan fungsi helper khusus untuk multipart (upload gambar)
async function postMultipart(url, data, withAuth = false) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: {
      ...(withAuth ? { Authorization: `Bearer ${token}` } : {}),
      // ❌ jangan pakai "Content-Type" di sini — biar browser set otomatis
    },
    body: data, // ← ini penting: body langsung FormData
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to create menu");
  }

  return res.json();
}

async function putMultipart(endpoint, formData, auth = true) {
  const headers = {};
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers,
    body: formData,
  });
  return handleResponse(res);
}

// 🔹 API groups (struktur TETAP sama)
const api = {
  // ----- AUTH (per-role) -----
  auth: {
    // ✅ Universal login
    login: (data) => post("/auth/login", data, false),

    // ✅ Register per role
    registerAdmin: (data) => post("/auth/register-admin", data, false),
    registerStaff: (data) => post("/auth/register-staff", data, false),
    registerEditor: (data) => post("/auth/register-editor", data, false),
    registerCustomer: (data) => post("/auth/register-customer", data, false),

    // ✅ Login per role
    loginAdmin: (data) => post("/auth/login-admin", data, false),
    loginStaff: (data) => post("/auth/login-staff", data, false),
    loginEditor: (data) => post("/auth/login-editor", data, false),
    loginCustomer: (data) => post("/auth/login-customer", data, false),

    // ✅ Profil user login (opsional)
    getProfile: () => get("/auth/profile", true),
  },

  // ----- MENUS (PRODUCTS) -----
  menus: {
    getAll: () => get("/menus", false),
    getById: (id) => get(`/menus/${id}`, false),
    create: (data) => post("/menus", data),
    update: (id, data) => put(`/menus/${id}`, data),
    delete: (id) => del(`/menus/${id}`), // ----- MENUS (PRODUCTS) -----
    menus: {
      getAll: () => get("/menus", false),
      getById: (id) => get(`/menus/${id}`, false),

      // ✅ pakai multipart biar bisa upload image
      create: async (formData) => {
        const token = getToken();
        const res = await fetch(`${API_URL}/menus`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ⚠️ jangan tambahkan Content-Type manual!
          },
          body: formData, // 🧩 kirim FormData langsung
        });
        return handleResponse(res);
      },

      update: async (id, formData) => {
        const token = getToken();
        const res = await fetch(`${API_URL}/menus/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        return handleResponse(res);
      },

      delete: (id) => del(`/menus/${id}`),
    },
  },

  // ----- CATEGORIES -----
  categories: {
    getAll: () => get("/categories", false),
    getById: (id) => get(`/categories/${id}`, false),
    create: (data) => post("/categories", data),
    update: (id, data) => put(`/categories/${id}`, data),
    delete: (id) => del(`/categories/${id}`),
  },

  // ----- CART -----
  cart: {
    getAll: () => get("/cart", true),
    addItem: (menuId, quantity = 1) =>
      post("/cart/add", { menuId, quantity }, true),
    removeItem: (cartItemId) => del(`/cart/${cartItemId}`, true),
    clear: () => del("/cart/clear", true),
    checkout: (selectedItems) =>
      post("/cart/checkout", { items: selectedItems }, true),
  },

  // ----- ORDERS -----
  orders: {
    getAll: () => get("/orders", true),
    getById: (id) => get(`/orders/${id}`, true),

    // ✅ Tambahan baru: buat order dari frontend checkout
    create: (data) => post("/orders", data, true),

    // ✅ Tambahan baru: simulasi payment (POST /orders/:id/pay)
    pay: (id) => post(`/orders/${id}/pay`, {}, true),
  },
};

export default api;
