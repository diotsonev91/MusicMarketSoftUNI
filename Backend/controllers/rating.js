// controllers/rating.js
const UserRating = require("../models/UserRating");
const ProductRating = require("../models/ProductRating");
const Ad = require("../models/Ad");

// Post User Rating (another user rating a user)
exports.postUserRating = async (req, res) => {
  try {
    const { ratedUserID, ratingValue } = req.body;

    if (req.user.id === ratedUserID) {
      return res.status(400).json({ error: "You cannot rate yourself" });
    }

    const rating = new UserRating({
      ratedUserID,
      raterUserID: req.user.id,
      ratingValue,
    });
    await rating.save();

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Post Ad Rating (user rating an ad)
exports.postAdRating = async (req, res) => {
  try {
    const { adID, ratingValue } = req.body;

    const ad = await Ad.findById(adID);
    if (!ad || ad.user.toString() === req.user.id) {
      return res.status(400).json({ error: "Invalid ad or cannot rate your own ad" });
    }

    const rating = new ProductRating({
      adID,
      userID: req.user.id,
      ratingValue,
    });
    await rating.save();

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all ratings and average rating for a user
exports.getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all ratings where the user is rated
    const ratings = await UserRating.find({ ratedUserID: userId });
    if (ratings.length === 0) return res.status(404).json({ error: "No ratings found for this user" });

    // Calculate the average rating
    const total = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0);
    const averageRating = total / ratings.length;

    res.json({ ratings, averageRating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all ratings and average rating for an ad
exports.getAdRatings = async (req, res) => {
  try {
    const { adId } = req.params;

    // Fetch all ratings for the specific ad
    const ratings = await ProductRating.find({ adID: adId });
    if (ratings.length === 0) return res.status(404).json({ error: "No ratings found for this ad" });

    // Calculate the average rating
    const total = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0);
    const averageRating = total / ratings.length;

    res.json({ ratings, averageRating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

