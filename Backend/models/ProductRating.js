const mongoose = require("mongoose");

const productRatingSchema = new mongoose.Schema({
  adID: { type: mongoose.Schema.Types.ObjectId, ref: "Ad", required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ratingValue: { type: Number, min: 1, max: 5, required: true },
  reviewText: { type: String, maxlength: 500 }, 
}, { timestamps: true });

module.exports = mongoose.model("ProductRating", productRatingSchema);
