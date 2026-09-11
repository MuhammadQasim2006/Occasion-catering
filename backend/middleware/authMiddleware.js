const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided. Please log in.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use user_id instead of id
    const user = await User.findByPk(decoded.user_id, {
      attributes: {
        exclude: ["password_hash"],
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found. Invalid token.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token. Please log in again.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired. Please log in again.",
      });
    }

    console.error("Auth error:", error);
    return res.status(500).json({
      success: false,
      error: "Authentication error",
    });
  }
};

// Optional auth: attaches req.user when a valid token is present, but
// never rejects the request when it's missing/invalid. Lets guest
// checkout and logged-in checkout share the same routes/controllers —
// the controller decides what to do based on whether req.user is set.
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.user_id, {
      attributes: {
        exclude: ["password_hash"],
      },
    });

    req.user = user || null;
    next();
  } catch (error) {
    // Bad/expired token on an optional route just means "treat as guest"
    // rather than blocking the request.
    req.user = null;
    next();
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Admin access required",
    });
  }

  next();
};

module.exports = {
  authMiddleware,
  optionalAuth,
  adminMiddleware,
};