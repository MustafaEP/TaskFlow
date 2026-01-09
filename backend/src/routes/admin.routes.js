const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.status(200).json({
      message: "Admin dashboard'a hoş geldiniz",
      user: {
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

module.exports = router;
