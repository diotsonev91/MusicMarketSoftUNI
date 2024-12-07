const express = require("express");
const { sendMessage, getMessages, deleteMessage } = require("../controllers/chat");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/send", auth(), sendMessage);      // Protected route
router.get("/", auth(), getMessages);           // Protected route
router.delete("/delete/:id",auth(), deleteMessage)
module.exports = router;
