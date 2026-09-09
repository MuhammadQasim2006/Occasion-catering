const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  User,
  Customer,
} = require("../models");

const JWT_SECRET = process.env.JWT_SECRET;

function createToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
}

async function register(req, res) {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
    } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    if (!first_name || typeof first_name !== "string") {
      return res.status(400).json({
        message: "First name is required",
      });
    }

    if (!last_name || typeof last_name !== "string") {
      return res.status(400).json({
        message: "Last name is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with that email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: normalizedEmail,
      password_hash: passwordHash,
      role: "customer",
    });

    const customer = await Customer.create({
      user_id: user.user_id,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      phone: phone ? phone.trim() : null,
    });

    const token = createToken(user);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
      customer: {
        customer_id: customer.customer_id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed",
    });
  }
}

async function login(req, res) {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const customer = await Customer.findOne({
      where: {
        user_id: user.user_id,
      },
    });

    const token = createToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
      customer: customer
        ? {
            customer_id: customer.customer_id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone: customer.phone,
          }
        : null,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
}

module.exports = {
  register,
  login,
};