import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api";

interface Technology {
  id: string;
  name: string;
  category: string | null;
  iconUrl: string | null;
}

export function Technologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "" });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<Technology[]>("/technologies");
      setTechnologies(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function resetForm() {
    setForm({ name: "", category: "" });
    setEditingId(null);
  }

  function startEdit(tech: Technology) {
    setEditingId(tech.id);
    setForm({ name: tech.name, category: tech.category ?? "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        name: form.name,
        category: form.category || undefined,
      };
      if (editingId) {
        await api.patch(`/technologies/${editingId}`, payload);
      } else {
        await api.post("/technologies", payload);
      }
      resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this technology?")) return;
    setError("");
    try {
      await api.delete(`/technologies/${id}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Technologies</h1>

      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem", display: "flex", gap: "0.5rem", alignItems: "end" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{ padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Category</label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{ padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
            Cancel
          </button>
        )}
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
            <th style={{ padding: "0.5rem" }}>Name</th>
            <th style={{ padding: "0.5rem" }}>Category</th>
            <th style={{ padding: "0.5rem", width: "150px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {technologies.map((tech) => (
            <tr key={tech.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>{tech.name}</td>
              <td style={{ padding: "0.5rem" }}>{tech.category ?? "—"}</td>
              <td style={{ padding: "0.5rem" }}>
                <button onClick={() => startEdit(tech)} style={{ marginRight: "0.5rem", cursor: "pointer" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(tech.id)} style={{ cursor: "pointer", color: "red" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {technologies.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: "1rem", textAlign: "center", color: "#999" }}>
                No technologies yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
