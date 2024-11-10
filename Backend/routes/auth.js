const express = require("express");
const { register, login, logout, refreshToken, getChatToken} = require("../controllers/auth");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken); 
router.post('/chat-token', auth(), getChatToken); // Protected route for Firebase token

module.exports = router;