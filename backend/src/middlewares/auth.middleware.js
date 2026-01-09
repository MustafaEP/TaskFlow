const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Authorization header kontrolü
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Yetkilendirme token'ı bulunamadı",
      });
    }

    // 2️⃣ Token'ı ayıkla
    const token = authHeader.split(" ")[1];

    // 3️⃣ Token doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Kullanıcıyı DB’den al
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Geçersiz token",
      });
    }

    // 5️⃣ Request içine user ekle
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Yetkilendirme başarısız",
    });
  }
};

module.exports = authMiddleware;
