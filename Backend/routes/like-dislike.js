const express = require("express");
const {
  likeDislikeAd,
  getAdLikeDislikeCounts,
  getUserAdState,
} = require("../controllers/likeDislikeAd");
const auth = require("../middleware/auth");

const router = express.Router();

// Protected route for posting like/dislikes
router.post("/",auth(),  likeDislikeAd);

// Get like/dislike counts for an ad
router.get("/counts/:adId", getAdLikeDislikeCounts);

// Get user state (like/dislike/neutral) for a specific ad
router.get("/state/:adId/:userId",  getUserAdState);

module.exports = router;
