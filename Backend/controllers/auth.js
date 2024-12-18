// controllers/auth.js
require("dotenv").config();  
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const admin = require('firebase-admin');

const DEFAULT_USER_ROLE = process.env.DEFAULT_USER_ROLE // switch if wants to create admin inside .env

exports.register = async (req, res) => {
  const { username, email, password, location, firstname, lastname } = req.body;

  try {
    // Check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const duplicateField = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({ error: `User with this ${duplicateField} already exists` });
    }

    // Ensure the password is defined
    if (!password) return res.status(400).json({ error: "Password is required" });

    // Create a new user instance with the provided data
    const user = new User({
      username,
      email,
      password, // Hash the password before saving
      role: DEFAULT_USER_ROLE,
      ...(location && { location }),       
      ...(firstname && { firstname }),    
      ...(lastname && { lastname }),       
    });

    // Save the new user to the database
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const refreshTokenStore = {}; // Keyed by user ID or username

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    // Store refresh token in memory
    refreshTokenStore[user._id] = refreshToken;

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      accessToken,
      currentUser: user, // Send user details
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Refresh Token Endpoint
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Read refresh token from cookies

  if (!refreshToken) {
    console.log("No refresh token found in cookies.");
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    console.log("Refresh Token received:", refreshToken);

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log("Decoded payload:", decoded);

    // Validate refresh token in memory
    if (refreshTokenStore[decoded.id] !== refreshToken) {
      console.log("Invalid or mismatched refresh token.");
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("New access token generated:", newAccessToken);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error verifying refresh token:", error.message);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};



// Logout user
exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: "Logged out successfully" });
};


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the requesting user is the same as the target user or if they are an admin
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Find the user to delete
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user's ads
    await Ad.deleteMany({ user: userId });

    // Delete the user profile
    await User.findByIdAndDelete(userId);

    res.json({ message: "User and associated ads deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatToken = async (req, res) => {
  try {
    const userId = req.user.id; // Extract the authenticated user ID

    // Generate Firebase token for the user
    const firebaseToken = await admin.auth().createCustomToken(userId);

    res.json({ firebaseToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
