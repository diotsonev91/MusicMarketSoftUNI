const express = require('express');
const { getConversations, deleteConversation, markAsRead } = require('../controllers/conversation');

const auth = require("../middleware/auth");
const router = express.Router();

//router.get('/', auth(), getConversations); // Get all conversations for the logged-in user
//router.delete('/:id', auth(), deleteConversation); // Delete a specific conversation
//router.patch('/:id/markAsRead', auth(), markAsRead )
console.log("Conversation routes initialized");

router.get('/', auth(), getConversations);
router.delete('/:id', auth(), deleteConversation);
router.patch('/:id/markAsRead',auth(),  markAsRead);
module.exports = router;