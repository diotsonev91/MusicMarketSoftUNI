const mongoose = require("mongoose");

const userRatingSchema = new mongoose.Schema({
  ratedUserID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  raterUserID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ratingValue: { type: Number, min: 1, max: 5 },
});

module.exports = mongoose.model("UserRating", userRatingSchema);
