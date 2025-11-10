import axios from "axios";

// Gunakan environment variable agar bisa otomatis pakai URL Railway di production
const BASE_URL = import.meta.env.VITE_API_URL || "https://final-project-backend-production-8bc6.up.railway.app";

const api = {
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

  categories: {
    getAll: async () => {
      const res = await axios.get(`${BASE_URL}/categories`);
      return res.data;
    },
  },

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
