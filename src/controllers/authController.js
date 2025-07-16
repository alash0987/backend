const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ValidationError = require("../utils/ValidationError");
const { request } = require("express");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res, next) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;
    console.log(req.body);

    const errors = [];

    // Field validation
    if (!username || username.length < 3) {
      errors.push("Username must be at least 3 characters long");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push("Please provide a valid email address");
    }

    if (!password || password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    // Check if user already exists with email
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new ValidationError(["User already exists with this email"]);
    }

    // Check if user already exists with username (optional but recommended)
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      throw new ValidationError(["Username is already taken"]);
    }

    // Create new user
    const user = new User({ username, email, password, first_name, last_name });
    const userId = await user.save();

    const token = generateToken(userId);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: userId,
        username,
        email,
        first_name,
        last_name,
      },
    });
  } catch (error) {
    next(error); // let central error handler respond
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json({
      user: req.user,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Server error fetching profile" });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
