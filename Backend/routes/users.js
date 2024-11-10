const express = require("express");
const { getUserById, getUserByUsername } = require("../controllers/user");
const router = express.Router();

// Route to get user public info by ID
router.get("/id/:id", getUserById);

// Route to get user public info by username
router.get("/username/:username", getUserByUsername);

module.exports = router;
