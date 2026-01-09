import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

const Tasks = () => {
  const { projectId } = useParams();
  const { isAuthenticated } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks/project/${projectId}`);
      setTasks(res.data.tasks);
    } catch (err) {
      setError("Task'ler alınamadı");
    }
  };

  useEffect(() => {
    if (isAuthenticated && projectId) {
      fetchTasks();
    }
  }, [isAuthenticated, projectId]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await api.post("/tasks", { title, projectId });
      setTitle("");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Task oluşturulamadı");
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      fetchTasks();
    } catch (err) {
      setError("Task güncellenemedi");
    }
  };

  const nextStatus = (status) => {
    if (status === "TODO") return "IN_PROGRESS";
    if (status === "IN_PROGRESS") return "DONE";
    return "DONE";
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Görevler</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Task Oluştur */}
      <form onSubmit={handleCreateTask} className="mb-4">
        <input
          className="form-control"
          placeholder="Yeni task başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </form>

      {/* Task Listesi */}
      <ul className="list-group">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{task.title}</strong>
              <div className="text-muted">{task.status}</div>
            </div>

            {task.status !== "DONE" && (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => updateStatus(task._id, nextStatus(task.status))}
              >
                İlerle
              </button>
            )}
          </li>
        ))}

        {tasks.length === 0 && (
          <li className="list-group-item text-muted">
            Henüz task yok
          </li>
        )}
      </ul>
    </div>
  );
};

export default Tasks;
