const Conversation = require('../models/Conversation');
const Chat = require('../models/Chat');

exports.getConversations = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Find conversations where the user is a participant
      const conversations = await Conversation.find({
        participant: { $elemMatch: { _id: userId } },
      })
        .populate('messages') // Populate messages in the conversation
        .populate('lastMessage') // Populate the last message
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