const Conversation = require('../models/Conversation');
const Chat = require('../models/Chat');
const mongoose = require('mongoose');
exports.getConversations = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id); // Use 'new' for ObjectId

    const conversations = await Conversation.find({
      'participants._id': userId, // Adjust path to match participants array
    })
      .populate('messages') // Populate messages
      .populate('lastMessage') // Populate lastMessage
      .sort({ 'lastMessage.timestamp': -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: error.message });
  }
};
  
  exports.deleteConversation = async (req, res) => {
    try {
      const conversationId = req.params.id;
      const userId = req.user.id;
  
      // Find the conversation
      const conversation = await Conversation.findById(conversationId);
  
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
  
      // Ensure the user is a participant
      if (!conversation.participant.some((p) => p._id.toString() === userId)) {
        return res.status(403).json({ error: 'Unauthorized to delete this conversation' });
      }
  
      // Delete all associated messages
      await Chat.deleteMany({ _id: { $in: conversation.messages } });
  
      // Delete the conversation
      await Conversation.findByIdAndDelete(conversationId);
  
      res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      res.status(500).json({ error: error.message });
    }
  };
  exports.markAsRead = async (req, res) => {
    try {
      const { id: conversationId } = req.params; // Use `id` if that's the parameter name in the route
      const userId = req.user.id;
  
      console.log('Conversation ID:', conversationId);
      console.log('Is conversationId valid ObjectId:', mongoose.Types.ObjectId.isValid(conversationId));
      console.log('User ID:', userId);
  
      const conversation = await Conversation.findById(conversationId);
  
      if (!conversation) {
        console.log('Conversation not found');
        return res.status(404).json({ message: 'Conversation not found' });
      }
  
      const readState = conversation.readStates.find(
        (state) => state.participantId.toString() === userId
      );
  
      console.log('Read state:', readState);
  
      if (readState) {
        readState.unreadCount = 0; // Reset unreadCount for this user
        await conversation.save();
      }
  
      res.status(200).json({ message: 'Marked as read' });
    } catch (error) {
      console.error('Error marking as read:', error);
      res.status(500).json({ error: error.message });
    }
  };