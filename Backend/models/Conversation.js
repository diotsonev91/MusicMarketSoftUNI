const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  participants: [
    {
      _id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
    },
  ],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Chat' },
  readStates: [
    {
      participantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      unreadCount: { type: Number, default: 0 },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
