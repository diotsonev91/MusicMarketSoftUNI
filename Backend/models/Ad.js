const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  adRate: { type: Number, default: null }, // Set initial rating to null
  price: { type: Number, required: true },
  
  // Enum for deliveryType
  deliveryType: { 
    type: String, 
    enum: ["за сметка на купувача", "за сметка на продавача"], 
    required: true 
  },
  
  // Enum for condition
  condition: { 
    type: String, 
    enum: ["употребявано", "ново"], 
    required: true 
  },
  
  // Enum for category
  category: { 
    type: String, 
    enum: ["инструмент", "музикална техника", "аксесоари"], 
    required: true 
  },

  subCategory: {
    type: String,
    enum: ["ударни", "духови", "струнни", "медни", "клавишни", "студио", "озвучаване", "други"],
    default: "други" // Set default to "others"
  },
  
  images: [String], // Array of image URLs
  instrument: String,
  technique: String,
  
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  userName: { 
    type: String, 
    required: true 
  }, // Add userName for fast frontend display
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  } // Add createdAt field
});

module.exports = mongoose.model("Ad", adSchema);
