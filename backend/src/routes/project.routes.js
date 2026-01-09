const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const {
  createProject,
  getMyProjects,
} = require("../controllers/project.controller");

// Proje oluştur
router.post("/", authMiddleware, createProject);

// Kullanıcının projeleri
router.get("/my", authMiddleware, getMyProjects);

module.exports = router;
