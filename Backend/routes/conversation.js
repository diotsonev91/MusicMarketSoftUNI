const express = require('express');
const { getConversations, deleteConversation } = require('../controllers/conversation');

const auth = require("../middleware/auth");
const router = express.Router();

router.get('/', auth(), getConversations); // Get all conversations for the logged-in user
router.delete('/:id', auth(), deleteConversation); // Delete a specific conversation

module.exports = router;