const express = require("express");
const { getUserById, getUserByUsername, editUser, deleteUser } = require("../controllers/user");
const router = express.Router();
const auth = require("../middleware/auth");
// Route to get user public info by ID
router.get("/id/:id", getUserById);

// Route to get user public info by username
router.get("/username/:username", getUserByUsername);
//protected 
router.put('/edit-user/:id', auth(), editUser);
router.delete('/delete-user/:id', auth(), deleteUser);

module.exports = router;
