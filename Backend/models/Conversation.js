const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  participant: {
    _id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
  },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Chat' }], // References to Chat messages
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Chat' }, // Last message in the conversation
  unreadCount: { type: Number, default: 0 }, // Count of unread messages for the user
});

module.exports = mongoose.model('Conversation', conversationSchema);