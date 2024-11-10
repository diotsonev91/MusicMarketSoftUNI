// models/Ad.js
const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  adRate: { type: Number, default: null }, // Set initial rating to null
  price: { type: Number, required: true },
  
  // Enum for deliveryType
  deliveryType: { 
    type: String, 
    enum: ["at the expense of the buyer", "at the expense of the seller"], 
    required: true 
  },
  
  // Enum for condition
  condition: { 
    type: String, 
    enum: ["old", "new"], 
    required: true 
  },
  
  // Enum for category
  category: { 
    type: String, 
    enum: ["instrument", "music technique", "accessories"], 
    required: true 
  },

  subCategory: {
    type: String,
    enum: ["percussion", "woodwind", "string", "brass" , "keyboard", "studio", "PA", "others"],
    default: "others" // Set default to "others"
  },
  
  images: [String], // Array of image URLs
  instrument: String,
  technique: String,
  
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }
});

module.exports = mongoose.model("Ad", adSchema);
