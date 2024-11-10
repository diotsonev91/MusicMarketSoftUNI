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
