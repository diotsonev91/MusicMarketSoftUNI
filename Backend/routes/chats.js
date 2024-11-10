const express = require("express");
const { sendMessage, getMessages } = require("../controllers/chat");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/send", auth(), sendMessage);      // Protected route
router.get("/", auth(), getMessages);           // Protected route

module.exports = router;
