import axios from "axios";

// =======================
// BASE URL BACKEND
// =======================
const BASE_URL = "https://final-project-backend-production-8bc6.up.railway.app";

// Helper buat ambil token terbaru dari localStorage setiap request
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// =======================
// AXIOS INSTANCE (JSON Default)
// =======================
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...getAuthHeader(),
  },
});

// =======================
// AUTH
// =======================
const auth = {
  login: async (email, password) => {
    const res = await instance.post("/auth/login", { email, password });
    return res.data;
  },
  register: async (data) => {
    const res = await instance.post("/auth/register", data);
    return res.data;
  },
};

// =======================
// MENUS
// =======================
const menus = {
  // Ambil semua menu
  getAll: async () => (await instance.get("/menus")).data,

  // Ambil menu by ID
  getById: async (id) => (await instance.get(`/menus/${id}`)).data,

  // Tambah menu baru (dengan upload gambar)
  create: async (formData) => {
    const res = await axios.post(`${BASE_URL}/menus`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeader(),
      },
    });
    return res.data;
  },

  // Update menu
  update: async (id, formData) => {
    const res = await axios.put(`${BASE_URL}/menus/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeader(),
      },
    });
    return res.data;
  },

  // Hapus menu
  delete: async (id) => {
    const res = await instance.delete(`/menus/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  },
};

// =======================
// CATEGORIES
// =======================
const categories = {
  getAll: async () => (await instance.get("/categories")).data,
};

// =======================
// ORDERS
// =======================
const orders = {
  getAll: async () =>
    (await instance.get("/orders", { headers: getAuthHeader() })).data,
  getById: async (id) =>
    (await instance.get(`/orders/${id}`, { headers: getAuthHeader() })).data,
  create: async (data) =>
    (await instance.post("/orders", data, { headers: getAuthHeader() })).data,
};

// =======================
// CART
// =======================
const cart = {
  getAll: async () =>
    (await instance.get("/cart", { headers: getAuthHeader() })).data,
  addItem: async (menuId, quantity) =>
    (
      await instance.post(
        "/cart",
        { menuId, quantity },
        { headers: getAuthHeader() }
      )
    ).data,
  removeItem: async (id) =>
    (await instance.delete(`/cart/${id}`, { headers: getAuthHeader() })).data,
};

// =======================
// EXPORT SEMUA API
// =======================
export default { auth, menus, categories, orders, cart };
