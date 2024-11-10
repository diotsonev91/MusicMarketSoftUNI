const mongoose = require("mongoose");

const productRatingSchema = new mongoose.Schema({
  adID: { type: mongoose.Schema.Types.ObjectId, ref: "Ad" },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ratingValue: { type: Number, min: 1, max: 5 },
});

module.exports = mongoose.model("ProductRating", productRatingSchema);
