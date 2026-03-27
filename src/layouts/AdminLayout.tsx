import { Outlet, Link } from "react-router";
import { signOut, useSession } from "../lib/auth-client";

export function AdminLayout() {
  const { data: session } = useSession();

  function handleLogout() {
    signOut({ fetchOptions: { onSuccess: () => window.location.assign("/admin/login") } });
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav style={{ width: "200px", padding: "1rem", borderRight: "1px solid #ddd", display: "flex", flexDirection: "column" }}>
        <h2 style={{ marginBottom: "1rem" }}>Admin</h2>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
          <li><Link to="/admin/projects">Projects</Link></li>
          <li><Link to="/admin/technologies">Technologies</Link></li>
        </ul>
        <div style={{ borderTop: "1px solid #ddd", paddingTop: "0.5rem", fontSize: "0.875rem" }}>
          <div style={{ marginBottom: "0.5rem" }}>{session?.user?.name}</div>
          <button onClick={handleLogout} style={{ cursor: "pointer", background: "none", border: "none", color: "#666", padding: 0 }}>
            Sign out
          </button>
        </div>
      </nav>
      <main style={{ flex: 1, padding: "1.5rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
