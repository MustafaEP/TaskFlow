import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

const Projects = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Projeleri getir
  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects/my");
      setProjects(res.data.projects);
    } catch (err) {
      setError("Projeler alınamadı");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  // Login değilse login sayfasına at
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Proje oluştur
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await api.post("/projects", { name, description });
      setName("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Proje oluşturulamadı");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Projelerim</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Proje Oluştur */}
      <form onSubmit={handleCreateProject} className="mb-4">
        <div className="mb-2">
          <input
            className="form-control"
            placeholder="Proje adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            placeholder="Açıklama (opsiyonel)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button className="btn btn-primary">Proje Oluştur</button>
      </form>

      {/* Proje Listesi */}
      <ul className="list-group">
        {projects.map((project) => (
          <li
            key={project._id}
            className="list-group-item list-group-item-action"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/projects/${project._id}/tasks`)}
          >
            <strong>{project.name}</strong>
            <div className="text-muted">{project.description}</div>
          </li>
        ))}

        {projects.length === 0 && (
          <li className="list-group-item text-muted">
            Henüz proje yok
          </li>
        )}
      </ul>
    </div>
  );
};

export default Projects;
