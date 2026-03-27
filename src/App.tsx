import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/admin/Login";
import { AdminLayout } from "./layouts/AdminLayout";
import { Projects } from "./pages/admin/Projects";
import { ProjectForm } from "./pages/admin/ProjectForm";
import { Technologies } from "./pages/admin/Technologies";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Projects />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id/edit" element={<ProjectForm />} />
          <Route path="technologies" element={<Technologies />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
