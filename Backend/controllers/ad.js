const Ad = require("../models/Ad");
const User = require("../models/User");

exports.createAd = async (req, res) => {
  try {
    const { title, description, price, deliveryType, condition, category, instrument, technique, subCategory } = req.body;

    // Assume `images` is an array of URLs uploaded to an external service
    const images = req.body.images || []; // Array of image URLs
    console.log("Images URLSs",images)
    // Log the user ID from the request
    //console.log("User ID from request (JWT):", req.user.id);

    // Create the ad object based on the category
    const adData = {
      title,
      description,
      adRate: null, // Set initial rating to null
      price,
      deliveryType,
      condition,
      images, // Store URLs of uploaded images
      category,
      subCategory: subCategory || "others",
      user: req.user.id, // Associate the ad with the logged-in user's ID
    };

    // Include only `instrument` or `technique` based on the category
    if (category === "instrument") {
      adData.instrument = instrument;
    } else if (category === "music technique") {
      adData.technique = technique;
    }

    // Save the new ad
    const ad = new Ad(adData);
    await ad.save();

    // Log the ad ID after saving it
    console.log("Created Ad ID:", ad._id);

    // Add the ad ID to the user's Adds array
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { adds: ad._id } }, // Add the ad ID to the Adds array
      { new: true } // Return the updated user document
    );

    // Log the updated user document to confirm the Adds array update
    console.log("Updated User Document:", updatedUser);

    // Return the created ad as the response
    res.status(201).json(ad);
  } catch (error) {
    console.error("Error in createAd:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Delete Ad
exports.deleteAd = async (req, res) => {
  try {
     // Find and delete the ad, ensuring it belongs to the logged-in user
    //  console.log("Deleting ad with ID:", req.params.id);
    //  console.log("Authenticated user ID:", req.user.id);
    // Find and delete the ad, ensuring it belongs to the logged-in user
    const ad = await Ad.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!ad) {
      return res.status(404).json({ error: "Ad not found or unauthorized" });
    }

    // Remove the ad ID from the user's adds array
    await User.findByIdAndUpdate(req.user.id, { $pull: { adds: req.params.id } });

    res.json({ message: "Ad deleted and removed from user's adds array" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit Ad
exports.editAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad || ad.user.toString() !== req.user.id) return res.status(404).json({ error: "Ad not found or unauthorized" });

    Object.assign(ad, req.body);
    await ad.save();
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Ad by ID
exports.getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate("user");
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Ads of a User
exports.getAllAdsOfUser = async (req, res) => {
  try {
    const ads = await Ad.find({ user: req.params.userId });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Ads (Public)
exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find({});
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Ads by Category and Subcategory (Public)
exports.getAdByCategoryThenSubcategory = async (req, res) => {
  try {
    const { category, subCategory } = req.params;
    const query = { category };

    if (subCategory) {
      query.subCategory = subCategory;
    }

    const ads = await Ad.find(query);
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
