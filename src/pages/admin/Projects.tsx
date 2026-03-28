import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { api } from "../../lib/api";

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  status: "draft" | "published";
  createdAt: string;
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<Project[]>("/projects/admin/all");
      setProjects(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    setError("");
    try {
      await api.delete(`/projects/${id}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1>Projects</h1>
        <Link to="/admin/projects/new" style={{ padding: "0.5rem 1rem", background: "#333", color: "white", textDecoration: "none", borderRadius: "4px" }}>
          New Project
        </Link>
      </div>

      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
            <th style={{ padding: "0.5rem" }}>Title</th>
            <th style={{ padding: "0.5rem" }}>Slug</th>
            <th style={{ padding: "0.5rem" }}>Status</th>
            <th style={{ padding: "0.5rem", width: "150px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>{project.title}</td>
              <td style={{ padding: "0.5rem", color: "#666" }}>{project.slug}</td>
              <td style={{ padding: "0.5rem" }}>
                <span style={{ padding: "0.125rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", background: project.status === "published" ? "#dcfce7" : "#f3f4f6", color: project.status === "published" ? "#166534" : "#374151" }}>
                  {project.status}
                </span>
              </td>
              <td style={{ padding: "0.5rem" }}>
                <Link to={`/admin/projects/${project.id}/edit`} style={{ marginRight: "0.5rem" }}>
                  Edit
                </Link>
                <button onClick={() => handleDelete(project.id)} style={{ cursor: "pointer", color: "red", background: "none", border: "none" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "1rem", textAlign: "center", color: "#999" }}>
                No projects yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
