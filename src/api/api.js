import axios from "axios";

// ✅ ganti dengan URL backend yang sudah dideploy
const BASE_URL = "https://final-project-backend-production-8bc6.up.railway.app";

const token = localStorage.getItem("token");

// Helper Axios Instance
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
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
  getAll: async () => (await instance.get("/menus")).data,
  getById: async (id) => (await instance.get(`/menus/${id}`)).data,
  create: async (formData) =>
    (
      await axios.post(`${BASE_URL}/menus`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data,
  update: async (id, formData) =>
    (
      await axios.put(`${BASE_URL}/menus/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data,
  delete: async (id) => (await instance.delete(`/menus/${id}`)).data,
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
  getAll: async () => (await instance.get("/orders")).data,
  getById: async (id) => (await instance.get(`/orders/${id}`)).data,
  create: async (data) => (await instance.post("/orders", data)).data,
};

// =======================
// CART
// =======================
const cart = {
  getAll: async () => (await instance.get("/cart")).data,
  addItem: async (menuId, quantity) =>
    (await instance.post("/cart", { menuId, quantity })).data,
  removeItem: async (id) => (await instance.delete(`/cart/${id}`)).data,
};

export default { auth, menus, categories, orders, cart };
