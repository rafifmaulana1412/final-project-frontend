import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Categories() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState(null);

  async function load() {
    try {
      const data = await api.categories.getAll();
      setItems(data);
    } catch (err) {
      console.error("❌ Failed to load categories:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editing) {
        await api.categories.update(editing, { name: form.name });
      } else {
        await api.categories.create({ name: form.name });
      }

      setForm({ name: "" });
      setEditing(null);
      load();
    } catch (err) {
      console.error("❌ Failed to save category:", err);
    }
  }

  async function handleDelete(id) {
    try {
      await api.categories.delete(id);
      load();
    } catch (err) {
      console.error("❌ Failed to delete:", err);
    }
  }

  return (
    <div className="p-4">
      <div className="card p-4 mb-4 shadow-sm">
        <h3 className="fw-bold text-primary mb-3">📚 Categories</h3>
        <form onSubmit={handleSubmit} className="d-flex gap-2">
          <input
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            className="form-control"
            placeholder="Enter category name"
            required
          />
          <button className="btn btn-primary">
            {editing ? "Update" : "Add"}
          </button>
        </form>
      </div>

      <div className="card p-3 shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Name</th>
              <th width="20%">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => {
                      setForm({ name: cat.name });
                      setEditing(cat.id);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(cat.id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
