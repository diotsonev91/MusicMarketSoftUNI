const express = require("express");
const { postUserRating, postAdRating, getUserRatings, getAdRatings, getTopRatedAds, getTopRatedAdsOfUser } = require("../controllers/rating");
const auth = require("../middleware/auth");

const router = express.Router();

// Protected routes for posting ratings
router.post("/user", auth(),  postUserRating);  // Post user rating
router.post("/ad",auth(),  postAdRating);      // Post ad rating

// Public routes for fetching ratings
router.get("/user/:userId", getUserRatings);   // Get all ratings and average for a user
router.get("/ad/:adId", getAdRatings);         // Get all ratings and average for an ad
router.get("/top", getTopRatedAds) //get top rated ads at all currently 5 
router.get("/top/:userId", getTopRatedAdsOfUser) //get top rated ads at all currently 5 
module.exports = router;
