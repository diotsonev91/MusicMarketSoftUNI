const express = require("express");
const { postUserRating, postAdRating } = require("../controllers/rating");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/user", auth(), postUserRating);  // Protected route
router.post("/ad", auth(), postAdRating);      // Protected route

module.exports = router;
