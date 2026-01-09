const Task = require("../models/Task");
const Project = require("../models/Project");
const { checkProjectOwnership } = require("../utils/ownership");

// Task oluştur
const createTask = async (req, res) => {
    try {
      const { title, description, projectId } = req.body;
  
      if (!title || !projectId) {
        return res.status(400).json({
          message: "Task başlığı ve projectId zorunludur",
        });
      }
  
      // Ownership kontrolü
      const project = await checkProjectOwnership(projectId, req.user._id);
      if (!project) {
        return res.status(403).json({
          message: "Bu projeye erişim yetkiniz yok",
        });
      }
  
      const task = await Task.create({
        title,
        description,
        project: projectId,
        owner: req.user._id,
      });
  
      res.status(201).json({
        message: "Task başarıyla oluşturuldu",
        task,
      });
    } catch (error) {
      res.status(500).json({
        message: "Task oluşturulurken hata oluştu",
        error: error.message,
      });
    }
};
  

const getTasksByProject = async (req, res) => {
    try {
      const { projectId } = req.params;
  
      // Ownership kontrolü
      const project = await checkProjectOwnership(projectId, req.user._id);
      if (!project) {
        return res.status(403).json({
          message: "Bu projeye erişim yetkiniz yok",
        });
      }
  
      const tasks = await Task.find({ project: projectId }).sort({
        createdAt: -1,
      });
  
      res.status(200).json({
        count: tasks.length,
        tasks,
      });
    } catch (error) {
      res.status(500).json({
        message: "Task'ler listelenirken hata oluştu",
        error: error.message,
      });
    }
  };
  
  const updateTaskStatus = async (req, res) => {
    try {
      const { taskId } = req.params;
      const { status } = req.body;
  
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          message: "Task bulunamadı",
        });
      }
  
      // Ownership kontrolü (task → project → owner)
      const project = await checkProjectOwnership(task.project, req.user._id);
      if (!project) {
        return res.status(403).json({
          message: "Bu task üzerinde yetkiniz yok",
        });
      }
  
      task.status = status;
      await task.save();
  
      res.status(200).json({
        message: "Task durumu güncellendi",
        task,
      });
    } catch (error) {
      res.status(500).json({
        message: "Task güncellenirken hata oluştu",
        error: error.message,
      });
    }
  };
  

module.exports = {
  createTask,
  getTasksByProject,
  updateTaskStatus,
};
