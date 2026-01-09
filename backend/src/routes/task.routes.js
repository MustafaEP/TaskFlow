const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const {
  createTask,
  getTasksByProject,
  updateTaskStatus,
} = require("../controllers/task.controller");

// Task oluştur
router.post("/", authMiddleware, createTask);

// Projeye ait task'leri getir
router.get("/project/:projectId", authMiddleware, getTasksByProject);

// Task status güncelle
router.patch("/:taskId/status", authMiddleware, updateTaskStatus);

module.exports = router;
