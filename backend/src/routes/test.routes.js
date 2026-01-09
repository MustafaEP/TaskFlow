const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Bu korumalı bir endpoint",
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;
