// controllers/chat.js
const Chat = require("../models/Chat");
const Conversation = require('../models/Conversation'); // Ensure Conversation model is imported
const User = require("../models/User");
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

    let conversation = await Conversation.findOne({
      'participants._id': { $all: [req.user.id, receiverID] },
    });

    if (conversation) {
      conversation.messages.push(message._id);
      conversation.lastMessage = message._id;

      // Increment unreadCount for all participants except the sender
      conversation.readStates.forEach((state) => {
        if (state.participantId.toString() !== req.user.id) {
          state.unreadCount += 1;
        }
      });

      await conversation.save();
    } else {
      const receiver = await User.findById(receiverID);

      conversation = new Conversation({
        participants: [
          { _id: req.user.id, username: req.user.username },
          { _id: receiver._id, username: receiver.username },
        ],
        messages: [message._id],
        lastMessage: message._id,
        readStates: [
          { participantId: req.user.id, unreadCount: 0 },
          { participantId: receiver._id, unreadCount: 1 },
        ],
      });

      await conversation.save();
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
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

exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    // Find the message by ID
    const message = await Chat.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if the user is the sender or receiver
    if (message.senderID.toString() !== userId && message.receiverID.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this message' });
    }

    // Delete the message
    await Chat.findByIdAndDelete(messageId);

    // Update the conversation
    const conversation = await Conversation.findOne({
      messages: messageId,
    });

    if (conversation) {
      conversation.messages = conversation.messages.filter((id) => id.toString() !== messageId);
      if (conversation.lastMessage?.toString() === messageId) {
        conversation.lastMessage = conversation.messages[conversation.messages.length - 1] || null;
      }
      await conversation.save();
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: error.message });
  }
};