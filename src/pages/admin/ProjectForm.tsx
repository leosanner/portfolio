import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../../lib/api";

interface Technology {
  id: string;
  name: string;
  category: string | null;
}

interface ProjectLink {
  label: string;
  url: string;
  type: "repository" | "demo" | "docs" | "other";
}

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  status: "draft" | "published";
  technologies: Technology[];
  links: ProjectLink[];
}

const emptyLink: ProjectLink = { label: "", url: "", type: "other" };

export function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [allTechnologies, setAllTechnologies] = useState<Technology[]>([]);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    status: "draft" as "draft" | "published",
    technologyIds: [] as string[],
    links: [] as ProjectLink[],
  });

  const loadTechnologies = useCallback(async () => {
    const data = await api.get<Technology[]>("/technologies");
    setAllTechnologies(data);
  }, []);

  const loadProject = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const project = await api.get<ProjectData>(`/projects/admin/${id}`);
      setForm({
        title: project.title,
        slug: project.slug,
        description: project.description,
        shortDescription: project.shortDescription,
        status: project.status,
        technologyIds: project.technologies.map((t) => t.id),
        links: project.links.length > 0 ? project.links : [],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTechnologies();
    if (isEdit) loadProject();
  }, [loadTechnologies, loadProject, isEdit]);

  function updateField(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleTechnology(techId: string) {
    setForm((prev) => ({
      ...prev,
      technologyIds: prev.technologyIds.includes(techId)
        ? prev.technologyIds.filter((id) => id !== techId)
        : [...prev.technologyIds, techId],
    }));
  }

  function addLink() {
    setForm((prev) => ({ ...prev, links: [...prev.links, { ...emptyLink }] }));
  }

  function updateLink(index: number, field: keyof ProjectLink, value: string) {
    setForm((prev) => ({
      ...prev,
      links: prev.links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link,
      ),
    }));
  }

  function removeLink(index: number) {
    setForm((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug || undefined,
        description: form.description,
        shortDescription: form.shortDescription,
        status: form.status,
        technologyIds: form.technologyIds.length > 0 ? form.technologyIds : undefined,
        links: form.links.length > 0 ? form.links : undefined,
      };

      if (isEdit) {
        await api.patch(`/projects/${id}`, payload);
      } else {
        await api.post("/projects", payload);
      }
      navigate("/admin/projects");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  const inputStyle = { padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px", width: "100%" };
  const labelStyle = { display: "block", fontSize: "0.875rem", marginBottom: "0.25rem", fontWeight: "600" as const };

  return (
    <div style={{ maxWidth: "700px" }}>
      <h1>{isEdit ? "Edit Project" : "New Project"}</h1>

      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Title *</label>
          <input value={form.title} onChange={(e) => updateField("title", e.target.value)} required style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Slug (auto-generated if empty)</label>
          <input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="my-project" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Short Description *</label>
          <input value={form.shortDescription} onChange={(e) => updateField("shortDescription", e.target.value)} required style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Description (Markdown) *</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            required
            rows={10}
            style={{ ...inputStyle, fontFamily: "monospace" }}
          />
        </div>

        <div>
          <label style={labelStyle}>Status</label>
          <select value={form.status} onChange={(e) => updateField("status", e.target.value)} style={inputStyle}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Technologies</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {allTechnologies.map((tech) => (
              <label key={tech.id} style={{ display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.technologyIds.includes(tech.id)}
                  onChange={() => toggleTechnology(tech.id)}
                />
                {tech.name}
              </label>
            ))}
            {allTechnologies.length === 0 && <span style={{ color: "#999" }}>No technologies available. Create some first.</span>}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Links</label>
            <button type="button" onClick={addLink} style={{ cursor: "pointer", fontSize: "0.875rem" }}>
              + Add Link
            </button>
          </div>
          {form.links.map((link, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
              <input
                value={link.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
                placeholder="Label"
                style={{ ...inputStyle, flex: 1 }}
              />
              <input
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                placeholder="https://..."
                style={{ ...inputStyle, flex: 2 }}
              />
              <select
                value={link.type}
                onChange={(e) => updateLink(i, "type", e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              >
                <option value="repository">Repository</option>
                <option value="demo">Demo</option>
                <option value="docs">Docs</option>
                <option value="other">Other</option>
              </select>
              <button type="button" onClick={() => removeLink(i)} style={{ cursor: "pointer", color: "red" }}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" disabled={saving} style={{ padding: "0.5rem 1.5rem", cursor: "pointer", background: "#333", color: "white", border: "none", borderRadius: "4px" }}>
            {saving ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
          <button type="button" onClick={() => navigate("/admin/projects")} style={{ padding: "0.5rem 1.5rem", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
