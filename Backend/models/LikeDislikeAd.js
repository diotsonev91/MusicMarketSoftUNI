const mongoose = require('mongoose');

const LikeDislikeSchema = new mongoose.Schema({
  adId: {
    type: String, // Change from ObjectId to String
    required: true,
  },
  userId: {
    type: String, // Change from ObjectId to String
    required: true,
  },
  like: {
    type: Boolean,
    default: false,
  },
  dislike: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('LikeDislike', LikeDislikeSchema);
