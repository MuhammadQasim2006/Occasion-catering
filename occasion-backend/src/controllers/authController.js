const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Customer } = require('../models');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create User record
    const newUser = await User.create({
      email,
      password_hash,
      role: 'customer',
    });

    // Create associated Customer record
    const newCustomer = await Customer.create({
      user_id: newUser.user_id,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
    });

    // Generate JWT
    const token = jwt.sign(
      { user_id: newUser.user_id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        user_id: newUser.user_id,
        customer_id: newCustomer.customer_id,
        email: newUser.email,
        role: newUser.role,
        firstName: newCustomer.first_name,
        lastName: newCustomer.last_name,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: { email },
      include: [{ model: Customer }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Issue JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        user_id: user.user_id,
        customer_id: user.Customer ? user.Customer.customer_id : null,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

// GET /api/auth/me
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ['password_hash'] },
      include: [{ model: Customer }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching profile.', error: error.message });
  }
};

module.exports = { register, login, getProfile };