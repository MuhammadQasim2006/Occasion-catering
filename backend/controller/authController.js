const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Op } = require("sequelize");

const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,  // Use user_id instead of id
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ============================================
// POST /api/auth/register
// ============================================
exports.register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: "Email, password and name are required",
      });
    }

    // Check if user exists (case-insensitive)
    const existingUser = await User.findOne({
      where: {
        email: { [Op.iLike]: email },
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    // Create user (password_hash will be hashed by model hook)
    const user = await User.create({
      email: email.toLowerCase(),
      password_hash: password, // Will be hashed by beforeCreate hook
      name,
      phone: phone || null,
      role: "customer",
    });

    // Generate token
    const token = generateToken(user);

    // Remove password_hash from response
    const userData = user.toJSON();
    delete userData.password_hash;

    res.status(201).json({
      success: true,
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      error: "Registration failed. Please try again.",
    });
  }
};

// ============================================
// POST /api/auth/login
// ============================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      where: {
        email: { [Op.iLike]: email },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check password (using model method)
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user);

    // Remove password_hash from response
    const userData = user.toJSON();
    delete userData.password_hash;

    res.json({
      success: true,
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed. Please try again.",
    });
  }
};

// ============================================
// GET /api/auth/me
// ============================================
exports.getMe = async (req, res) => {
  try {
    // User is already attached by auth middleware
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get user profile",
    });
  }
};