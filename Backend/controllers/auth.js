// controllers/auth.js
require("dotenv").config();  
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const DEFAULT_USER_ROLE = process.env.DEFAULT_USER_ROLE

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Ensure the password is defined
    if (!password) return res.status(400).json({ error: "Password is required" });
 

    // Create and save the new user
    const user = new User({ username, email, password: password, role: DEFAULT_USER_ROLE });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate access token (1-hour expiration)
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Generate refresh token (30-day expiration)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    // Save the refresh token in the user's record
    user.refreshToken = refreshToken;
    await user.save();

    // Send both tokens to the client
    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    // Verify the refresh token with the refresh token secret
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user associated with the refresh token
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Generate a new access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

// Logout user
exports.logout = async (req, res) => {
  const { userId } = req.body;

  try {
    // Find the user by ID and clear the refresh token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    user.refreshToken = null; // Clear the refresh token
    await user.save();

    res.json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};