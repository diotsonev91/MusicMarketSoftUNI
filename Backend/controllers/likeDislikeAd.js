const LikeDislike = require("../models/LikeDislikeAd");

exports.likeDislikeAd = async (req, res) => {
    const { userId, adId, action } = req.body;
  
    console.log('Received Action:', action, 'Ad ID:', adId, 'User ID:', userId);
  
    // Validate input
    if (
      !userId ||
      typeof userId !== "string" ||
      !adId ||
      typeof adId !== "string" ||
      !["like", "dislike", "neutral"].includes(action)
    ) {
      return res.status(400).json({ error: "Invalid request" });
    }
  
    try {
      // Find an existing like/dislike record
      let likeDislike = await LikeDislike.findOne({ userId, adId });
  
      if (likeDislike) {
        // Update like/dislike fields based on the action
        if (action === "like") {
          likeDislike.like = true;
          likeDislike.dislike = false;
        } else if (action === "dislike") {
          likeDislike.like = false;
          likeDislike.dislike = true;
        } else if (action === "neutral") {
          likeDislike.like = false;
          likeDislike.dislike = false;
        }
        await likeDislike.save();
      } else {
        // Create a new like/dislike record
        likeDislike = new LikeDislike({
          userId,
          adId,
          like: action === "like",
          dislike: action === "dislike",
        });
        await likeDislike.save();
      }
  
      res.status(200).json({ message: "Action recorded", likeDislike });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };

// Get like and dislike counts for a specific ad
exports.getAdLikeDislikeCounts = async (req, res) => {
    const { adId } = req.params;
  
    // Validate input
    if (!adId || typeof adId !== "string") {
      return res.status(400).json({ error: "Ad ID is required" });
    }
  
    try {
      // Count likes and dislikes based on the schema fields
      const likes = await LikeDislike.countDocuments({ adId, like: true });
      const dislikes = await LikeDislike.countDocuments({ adId, dislike: true });
  
      res.status(200).json({ adId, likes, dislikes });
    } catch (error) {
      console.error("Error fetching like/dislike counts:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
// Get the user's state (like, dislike, or neutral) for a specific ad
exports.getUserAdState = async (req, res) => {
    const { userId, adId } = req.params;
  
    console.log("Fetching user ad state:", { userId, adId });
  
    // Validate input
    if (!userId || typeof userId !== "string" || !adId || typeof adId !== "string") {
      return res.status(400).json({ error: "User ID and Ad ID are required" });
    }
  
    try {
      // Find the user's like/dislike record
      const likeDislike = await LikeDislike.findOne({ userId, adId });
  
      if (!likeDislike) {
        // No record exists, so the state is neutral
        return res.status(200).json({ adId, userId, status: "neutral" });
      }
  
      // Determine the user's state
      let status = "neutral";
      if (likeDislike.like) {
        status = "like";
      } else if (likeDislike.dislike) {
        status = "dislike";
      }
  
      res.status(200).json({ adId, userId, status });
    } catch (error) {
      console.error("Error fetching user ad state:", error);
      res.status(500).json({ error: "Server error" });
    }
  };