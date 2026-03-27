import { Outlet, Link } from "react-router";

export function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav style={{ width: "200px", padding: "1rem", borderRight: "1px solid #ddd" }}>
        <h2 style={{ marginBottom: "1rem" }}>Admin</h2>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <li><Link to="/admin/projects">Projects</Link></li>
          <li><Link to="/admin/technologies">Technologies</Link></li>
        </ul>
      </nav>
      <main style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
