const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstname: String,
  lastname: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  adds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ad" }],
  userRate: Number,
  location: String,
  favoriteAds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ad" }],
  chat: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  refreshToken: { type: String, default: null }, 
});

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
