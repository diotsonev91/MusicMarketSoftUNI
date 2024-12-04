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

// Post or Update Ad Rating (user rating an ad)
exports.postAdRating = async (req, res) => {
  try {
    const { adID, userID, ratingValue, reviewText } = req.body;
    console.log(req.body);
    // Validate input
    if (!adID || !userID || !ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Validate the ad exists
    const ad = await Ad.findById(adID);
    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }

    // Check if the user has already rated the ad
    const existingRating = await ProductRating.findOne({ adID, userID });

    if (existingRating) {
      // Update the existing rating
      existingRating.ratingValue = ratingValue;
      existingRating.reviewText = reviewText || null; // Update or clear review text
      await existingRating.save();

      // Optionally recalculate average rating
      const averageRating = await calculateAdAverageRating(adID);

      return res.status(200).json({
        message: "Rating updated successfully",
        rating: existingRating,
        averageRating, // Include the updated average rating
      });
    }

    // Create a new rating if none exists
    const rating = new ProductRating({
      adID,
      userID,
      ratingValue,
      reviewText,
    });
    await rating.save();

    // Optionally recalculate average rating
    const averageRating = await calculateAdAverageRating(adID);

    res.status(201).json({
      message: "Rating created successfully",
      rating,
      averageRating, // Include the updated average rating
    });
  } catch (error) {
    console.error("Error posting/updating ad rating:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper function to calculate the average rating for an ad
const calculateAdAverageRating = async (adID) => {
  const ratings = await ProductRating.find({ adID });

  if (ratings.length === 0) return 0;

  const totalRating = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0);
  return (totalRating / ratings.length).toFixed(2);
};

exports.getAdRatings = async (req, res) => {
  try {
    const { adId } = req.params;

    // Fetch all ratings for the specific ad
    const ratings = await ProductRating.find({ adID: adId }).populate("userID", "username email");
    if (ratings.length === 0) {
      return res.status(404).json({ error: "No ratings found for this ad" });
    }

    // Calculate the average rating
    const total = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0);
    const averageRating = total / ratings.length;

    // Return all ratings and the average
    res.json({
      ratings,
      averageRating,
    });
  } catch (error) {
    console.error("Error fetching ad ratings:", error);
    res.status(500).json({ error: error.message });
  }
};