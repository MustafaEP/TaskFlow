const Project = require("../models/Project");

// Proje oluştur
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Proje adı zorunludur",
      });
    }

    const project = await Project.create({
      name,
      description,
      owner: req.user._id, // ownership burada
    });

    res.status(201).json({
      message: "Proje başarıyla oluşturuldu",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Proje oluşturulurken hata oluştu",
      error: error.message,
    });
  }
};

// Kullanıcının projelerini listele
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Projeler listelenirken hata oluştu",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getMyProjects,
};
