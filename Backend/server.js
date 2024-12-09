// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config(); // Load environment variables

const app = express();
app.use(express.json());

app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    // Allow localhost origins or requests with no origin (e.g., Postman or preflight)
    if (!origin || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

//static folder
app.use("/uploads", express.static("uploads"));


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

//Set Up Firebase Admin SDK

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const adRoutes = require("./routes/ads");
const ratingRoutes = require("./routes/ratings");
const chatRoutes = require("./routes/chats"); // Assuming this is created for chat functionalities
const likeDislike = require("./routes/like-dislike")
const conversation = require("./routes/conversation")
console.log("Conversation module:", conversation);
// Use routes
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/auth", authRoutes);       // For authentication (register, login, logout)
app.use("/users", userRoutes);       // For user info retrieval and other user-related routes
app.use("/ads", adRoutes);           // For ad-related operations (create, delete, edit, etc.)
app.use("/ratings", ratingRoutes);   // For user and ad ratings
app.use("/chats", chatRoutes);       // For chat-related operations
app.use("/like-dislike",likeDislike)
app.use("/conversations",conversation)
// Catch-all 404 route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`${Object.keys(middleware.route.methods)[0].toUpperCase()} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((nestedMiddleware) => {
      if (nestedMiddleware.route) {
        console.log(`${Object.keys(nestedMiddleware.route.methods)[0].toUpperCase()} ${nestedMiddleware.route.path}`);
      }
    });
  }
});

// Define the PORT and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



