import axios from "axios";

const BASE_URL = "https://final-project-backend-production-8bc6.up.railway.app";

const instance = axios.create({
  baseURL: BASE_URL,
});

// 🔥 Interceptor untuk otomatis nambah Authorization header di setiap request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================== AUTH ==================
const auth = {
  login: async (email, password) => (await instance.post("/auth/login", { email, password })).data,
  register: async (data) => (await instance.post("/auth/register", data)).data,
};

// ================== MENUS ==================
const menus = {
  getAll: async () => (await instance.get("/menus")).data,
  getById: async (id) => (await instance.get(`/menus/${id}`)).data,
  create: async (formData) =>
    (await instance.post("/menus", formData, { headers: { "Content-Type": "multipart/form-data" } })).data,
  update: async (id, formData) =>
    (await instance.put(`/menus/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })).data,
  delete: async (id) => (await instance.delete(`/menus/${id}`)).data,
};

// ================== OTHERS ==================
const categories = { getAll: async () => (await instance.get("/categories")).data };
const orders = { getAll: async () => (await instance.get("/orders")).data };
const cart = {
  getAll: async () => (await instance.get("/cart")).data,
  addItem: async (menuId, quantity) => (await instance.post("/cart", { menuId, quantity })).data,
  removeItem: async (id) => (await instance.delete(`/cart/${id}`)).data,
};

export default { auth, menus, categories, orders, cart };
