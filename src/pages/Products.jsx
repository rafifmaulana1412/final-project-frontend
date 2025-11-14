import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://final-project-backend-production-8bc6.up.railway.app";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Form add NEW menu
  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // MODAL EDIT
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  // MODAL DELETE
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [editing, setEditing] = useState(null);

  const { user } = useAuth();
  const { incrementCart } = useCart();

  async function load() {
    try {
      const menus = await api.menus.getAll();
      const cats = await api.categories.getAll();
      setProducts(menus);
      setFilteredProducts(menus);
      setCategories(cats);
    } catch (err) {
      console.error("❌ Failed to load products:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleFilter(categoryName) {
    setSelectedCategory(categoryName);
    applyFilter(categoryName, searchQuery);
  }

  function applyFilter(categoryName, query) {
    let filtered = products;

    if (categoryName !== "All") {
      filtered = filtered.filter((p) => p.menuCategory?.name === categoryName);
    }

    if (query) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    const container = document.getElementById("menu-container");
    if (container) {
      container.style.opacity = 0;
      setTimeout(() => {
        setFilteredProducts(filtered);
        container.style.opacity = 1;
      }, 200);
    } else {
      setFilteredProducts(filtered);
    }
  }

  function handleSearch(e) {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilter(selectedCategory, query);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("categoryId", form.categoryId);
      formData.append("description", form.description);
      if (imageFile) formData.append("image", imageFile);

      await api.menus.create(formData);
      alert("✅ Menu berhasil ditambahkan!");

      setForm({ name: "", price: "", categoryId: "", description: "" });
      setImageFile(null);
      setPreview(null);
      setEditing(null);
      await load();
    } catch (err) {
      console.error("❌ Failed to save product:", err);
      alert("❌ Gagal menambahkan menu. Coba lagi!");
    }
  }

  // =============== EDIT MENU =================
  async function handleUpdateModal(e) {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("name", editData.name);
      fd.append("price", editData.price);
      fd.append("categoryId", editData.categoryId);
      fd.append("description", editData.description);

      if (editData.image instanceof File) {
        fd.append("image", editData.image);
      }

      await api.menus.update(editData.id, fd);

      setEditModalOpen(false);
      setEditData(null);
      await load();
      alert("✅ Menu updated!");
    } catch (err) {
      console.error("❌ Failed to update:", err);
      alert("Update failed!");
    }
  }

  async function handleAddToCart(menuId) {
    try {
      await api.cart.addItem(menuId, 1);
      incrementCart();
      alert("✅ Added to cart!");
    } catch (err) {
      alert("❌ Failed to add to cart: " + err.message);
    }
  }

  return (
    <div
      className="container py-5"
      style={{
        background: "linear-gradient(135deg, #f9fafb, #e0f2fe)",
        minHeight: "100vh",
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <h3 className="text-center fw-bold text-primary mb-4">🍽️ Products</h3>

      {/* ============ SEARCH & FILTER (Customer only) ============= */}
      {user?.role === "customer" && (
        <div className="text-center mb-4">
          <div className="mb-3 d-flex justify-content-center">
            <input
              type="text"
              placeholder="🔍 Search menu..."
              className="form-control w-50 shadow-sm"
              value={searchQuery}
              onChange={handleSearch}
              style={{
                borderRadius: "20px",
                padding: "8px 16px",
                border: "1px solid #cbd5e1",
              }}
            />
          </div>

          <div
            className="d-flex justify-content-center gap-2 flex-nowrap overflow-auto px-2"
            style={{ scrollBehavior: "smooth" }}
          >
            <button
              className={`btn btn-sm ${
                selectedCategory === "All"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => handleFilter("All")}
            >
              All Menu
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                className={`btn btn-sm ${
                  selectedCategory === c.name
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => handleFilter(c.name)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= FORM ADD MENU (Staff/Admin) =============== */}
      {user?.role !== "customer" && (
        <form
          onSubmit={handleSubmit}
          className="row g-2 mb-4 align-items-center"
          encType="multipart/form-data"
        >
          <div className="col-md-3">
            <input
              name="name"
              placeholder="Name"
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              name="price"
              placeholder="Price"
              type="number"
              className="form-control"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              name="description"
              placeholder="Description"
              className="form-control"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <select
              name="categoryId"
              className="form-select"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary">Add</button>
          </div>
          {preview && (
            <div className="mt-3 text-center">
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "150px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}
        </form>
      )}

      {/* ===================== PRODUCT LIST ======================== */}
      <div
        id="menu-container"
        className="row g-4"
        style={{ transition: "opacity 0.3s ease-in-out" }}
      >
        {filteredProducts.map((p) => (
          <div key={p.id} className="col-md-4 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <img
                src={
                  p.image
                    ? `${BASE_URL}${p.image}`
                    : "https://via.placeholder.com/200x150?text=No+Image"
                }
                className="card-img-top"
                alt={p.name}
                style={{
                  height: "180px",
                  objectFit: "cover",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="fw-semibold">{p.name}</h5>

                {p.description && (
                  <p
                    className="text-muted small mb-1"
                    style={{
                      fontStyle: "italic",
                      color: "#6b7280",
                      lineHeight: "1.4",
                    }}
                  >
                    {p.description.length > 70
                      ? p.description.slice(0, 70) + "..."
                      : p.description}
                  </p>
                )}

                <p className="text-muted small">
                  Category: {p.menuCategory?.name || "-"}
                </p>
                <p className="fw-bold text-success">
                  Rp {p.price?.toLocaleString()}
                </p>

                <div className="mt-auto">
                  {user?.role !== "customer" ? (
                    <div className="d-flex justify-content-between">
                      {/* ===== EDIT BUTTON (MODAL) ===== */}
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                          setEditData({
                            ...p,
                            categoryId: p.categoryId,
                            image: null,
                          });

                          setEditPreview(
                            p.image ? `${BASE_URL}${p.image}` : null
                          );

                          setEditModalOpen(true);
                        }}
                      >
                        ✏️ Edit
                      </button>

                      {/* ===== DELETE BUTTON (CONFIRM MODAL) ===== */}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          setDeleteTarget(p);
                          setDeleteModalOpen(true);
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm w-100"
                      onClick={() => handleAddToCart(p.id)}
                    >
                      🛒 Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== MODAL EDIT MENU ===================== */}
      {editModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-4">

              <h4 className="fw-bold mb-3">Edit Menu</h4>

              <form
                onSubmit={handleUpdateModal}
                className="d-flex flex-column gap-3"
              >
                <input
                  className="form-control"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  placeholder="Name"
                  required
                />

                <input
                  type="number"
                  className="form-control"
                  value={editData.price}
                  onChange={(e) =>
                    setEditData({ ...editData, price: e.target.value })
                  }
                  placeholder="Price"
                  required
                />

                <textarea
                  className="form-control"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description"
                />

                <select
                  className="form-select"
                  value={editData.categoryId}
                  onChange={(e) =>
                    setEditData({ ...editData, categoryId: e.target.value })
                  }
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <div>
                  <label className="form-label fw-bold">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setEditData({ ...editData, image: file });
                      setEditPreview(URL.createObjectURL(file));
                    }}
                  />
                </div>

                {editPreview && (
                  <div className="text-center mt-2">
                    <img
                      src={editPreview}
                      style={{
                        width: "180px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                )}

                <button className="btn btn-primary">Save Changes</button>
              </form>

              <button
                className="btn btn-secondary mt-3"
                onClick={() => setEditModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL DELETE CONFIRM ===================== */}
      {deleteModalOpen && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h4 className="fw-bold text-danger mb-3">Confirm Delete</h4>

              <p>
                Are you sure you want to delete{" "}
                <strong>{deleteTarget?.name}</strong>?
              </p>

              <div className="d-flex justify-content-end gap-2 mt-4">

                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    await api.menus.delete(deleteTarget.id);
                    setDeleteModalOpen(false);
                    setDeleteTarget(null);
                    load();
                    alert("🗑️ Menu deleted successfully!");
                  }}
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
