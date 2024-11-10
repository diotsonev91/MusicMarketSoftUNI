const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  senderID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  timestamp: { type: Date, default: Date.now },
  viewed: { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
});

module.exports = mongoose.model("Chat", chatSchema);
