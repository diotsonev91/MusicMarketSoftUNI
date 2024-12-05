// controllers/chat.js
const Chat = require("../models/Chat");

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverID, content } = req.body;

    const message = new Chat({
      senderID: req.user.id,
      receiverID,
      content,
      timestamp: new Date(),
    });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Messages Related to User
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    // Retrieve messages where the user is either the sender or receiver
    const messages = await Chat.find({
      $or: [{ senderID: userId }, { receiverID: userId }],
    })
      .populate('senderID', 'username email') // Populate senderID with selected fields
      .populate('receiverID', 'username email') // Populate receiverID with selected fields
      .sort({ timestamp: 1 }); // Sort by timestamp

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
};