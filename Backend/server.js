// server.js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(express.json());


// Access MongoDB URI from environment variables
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI is not defined in the .env file");
  process.exit(1);
}


// Connect to MongoDB using Mongoose
mongoose.connect(mongoUri)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection error:", error));

// Basic endpoint for testing
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const adRoutes = require("./routes/ads");
const ratingRoutes = require("./routes/ratings");
const chatRoutes = require("./routes/chats"); // Assuming this is created for chat functionalities

// Use routes
app.use("/auth", authRoutes);       // For authentication (register, login, logout)
app.use("/users", userRoutes);       // For user info retrieval and other user-related routes
app.use("/ads", adRoutes);           // For ad-related operations (create, delete, edit, etc.)
app.use("/ratings", ratingRoutes);   // For user and ad ratings
app.use("/chats", chatRoutes);       // For chat-related operations

// Define the PORT and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
