const Ad = require("../models/Ad");
const User = require("../models/User");

exports.createAd = async (req, res) => {
  try {
    const { title, description, price, deliveryType, condition, category, instrument, technique, subCategory } = req.body;

    // Assume `images` is an array of URLs uploaded to an external service
    const images = req.body.images || []; // Array of image BASE 64s
    console.log("Images Base64s",images)
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
    const isAdmin = req.user.role === "admin";

    // If the user is an admin, find the ad by ID without user restriction
    let ad;
    if (isAdmin) {
      ad = await Ad.findById(req.params.id);
    } else {
      // Otherwise, only allow the user to delete their own ad
      ad = await Ad.findOne({ _id: req.params.id, user: req.user.id });
    }

    if (!ad) {
      return res.status(404).json({ error: "Ad not found or unauthorized" });
    }

    // Remove the ad ID from the owner's `adds` array
    await User.findByIdAndUpdate(ad.user, { $pull: { adds: req.params.id } });

    // Delete the ad from the ads collection
    await Ad.findByIdAndDelete(req.params.id);

    res.json({ message: "Ad deleted and removed from owner's adds array" });
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

// Get Ads by Price Range
exports.getAdByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    // Validate price range inputs
    if (!minPrice || !maxPrice) {
      return res.status(400).json({ error: "Please provide both minPrice and maxPrice" });
    }

    // Fetch ads within the price range
    const ads = await Ad.find({
      price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }
    });

    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Ads by Category, Subcategory, and Price Range
exports.getAdByCategoryThenSubcategoryThenPriceRange = async (req, res) => {
  try {
    const { category, subCategory } = req.params;
    const { minPrice, maxPrice } = req.query;

    console.log("min price",minPrice);
    console.log("max price", maxPrice);
    // Validate price range inputs
    if (!minPrice || !maxPrice) {
      return res.status(400).json({ error: "Please provide both minPrice and maxPrice" });
    }

    // Build the query based on category, subcategory, and price range
    const query = {
      category,
      price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }
    };
    if (subCategory) {
      query.subCategory = subCategory;
    }

    const ads = await Ad.find(query);
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Ads by Price Range
exports.getAdByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    // Validate price range inputs
    if (!minPrice || !maxPrice) {
      return res.status(400).json({ error: "Please provide both minPrice and maxPrice" });
    }

    // Fetch ads within the price range
    const ads = await Ad.find({
      price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }
    });

    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Ads by Category, Subcategory, and Price Range
exports.getAdByCategoryThenSubcategoryThenPriceRange = async (req, res) => {
  try {
    const { category, subCategory } = req.params;
    const { minPrice, maxPrice } = req.query;

    // Validate price range inputs
    if (!minPrice || !maxPrice) {
      return res.status(400).json({ error: "Please provide both minPrice and maxPrice" });
    }

    // Build the query based on category, subcategory, and price range
    const query = {
      category,
      price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }
    };
    if (subCategory) {
      query.subCategory = subCategory;
    }

    const ads = await Ad.find(query);
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

