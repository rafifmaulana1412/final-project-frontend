import axios from "axios";

// ✅ gunakan environment variable biar otomatis pilih URL Railway saat di-deploy
const BASE_URL = import.meta.env.VITE_API_URL || "https://final-project-backend-production-8bc6.up.railway.app";

const api = {
  // 🔐 AUTH
  auth: {
    login: async (email, password) => {
      const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      return res.data;
    },
    register: async (name, email, password) => {
      const res = await axios.post(`${BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });
      return res.data;
    },
    me: async (token) => {
      const res = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  },

  // 🍽️ MENUS
  menus: {
    getAll: async () => {
      const res = await axios.get(`${BASE_URL}/menus`);
      return res.data;
    },
    getById: async (id) => {
      const res = await axios.get(`${BASE_URL}/menus/${id}`);
      return res.data;
    },
    create: async (data) => {
      const res = await axios.post(`${BASE_URL}/menus`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    update: async (id, data) => {
      const res = await axios.put(`${BASE_URL}/menus/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    delete: async (id) => {
      const res = await axios.delete(`${BASE_URL}/menus/${id}`);
      return res.data;
    },
  },

  // 🧭 CATEGORIES
  categories: {
    getAll: async () => {
      const res = await axios.get(`${BASE_URL}/categories`);
      return res.data;
    },
  },

  // 🛒 CART
  cart: {
    addItem: async (menuId, quantity = 1) => {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/cart`,
        { menuId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
  },
};

export default api;
