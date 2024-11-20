const multer = require("multer");
const Ad = require("../models/Ad");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");


// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

exports.createAd = [
  upload.array("images", 5), // Handle up to 5 image files
  async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        deliveryType,
        condition,
        category,
        subCategory,
        instrument,
        technique,
      } = req.body;

      // Get the logged-in user's name from the User model
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Collect file paths from uploaded files
      const imagePaths = req.files.map((file) => `uploads/${file.filename}`); // Relative path


      // Create the ad object
      const adData = {
        title,
        description,
        price,
        deliveryType,
        condition,
        category,
        subCategory: subCategory || "други", // Default to "други"
        images: imagePaths, // Store file paths
        instrument: category === "инструмент" ? instrument : undefined,
        technique: category === "музикална техника" ? technique : undefined,
        user: req.user.id,
        userName: user.username, // Store the user's name for quick access
        createdAt: new Date(),
      };

      const ad = new Ad(adData);
      await ad.save();

      // Add the ad ID to the user's "adds" array
      await User.findByIdAndUpdate(req.user.id, { $push: { adds: ad._id } });

      res.status(201).json(ad);
    } catch (error) {
      console.error("Error in createAd:", error.message);
      res.status(500).json({ error: error.message });
    }
  },
];


exports.deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad || ad.user.toString() !== req.user.id) {
      return res.status(404).json({ error: "Ad not found or unauthorized" });
    }

    // Remove associated files
    ad.images.forEach((imagePath) => {
      const fullPath = path.join(__dirname, "..", imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // Delete file
      }
    });

    // Delete ad
    await Ad.findByIdAndDelete(req.params.id);

    res.json({ message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAd:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.editAd = [
  upload.array("images", 5), // Handle up to 5 new image files
  async (req, res) => {
    try {
      const ad = await Ad.findById(req.params.id);

      if (!ad || ad.user.toString() !== req.user.id) {
        return res.status(404).json({ error: "Ad not found or unauthorized" });
      }

      const {
        title,
        description,
        price,
        deliveryType,
        condition,
        category,
        subCategory,
        instrument,
        technique,
      } = req.body;

      // Process new image uploads
      const newImagePaths = req.files.map((file) => file.path);

      // Update the ad with new and existing data
      ad.title = title || ad.title;
      ad.description = description || ad.description;
      ad.price = price || ad.price;
      ad.deliveryType = deliveryType || ad.deliveryType;
      ad.condition = condition || ad.condition;
      ad.category = category || ad.category;
      ad.subCategory = subCategory || ad.subCategory;
      ad.instrument = category === "инструмент" ? instrument : ad.instrument;
      ad.technique = category === "музикална техника" ? technique : ad.technique;

      // Add new images to the existing ones
      ad.images = [...ad.images, ...newImagePaths];

      await ad.save();
      res.json(ad);
    } catch (error) {
      console.error("Error in editAd:", error.message);
      res.status(500).json({ error: error.message });
    }
  },
];

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

