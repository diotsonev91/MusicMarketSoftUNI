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

      // Validate the existence of the ad and the user's permission
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
        remainingImages, // Sent as a JSON array from the frontend
      } = req.body;

      // Parse remainingImages safely
      const parsedRemainingImages = Array.isArray(remainingImages)
        ? remainingImages
        : JSON.parse(remainingImages || '[]');

      // Validate that remainingImages is a valid array
      if (!Array.isArray(parsedRemainingImages)) {
        return res.status(400).json({ error: "Invalid remainingImages format" });
      }

      // Process new image uploads
      const newImagePaths = req.files.map((file) => file.path);

      // Update ad fields if provided
      ad.title = title || ad.title;
      ad.description = description || ad.description;
      ad.price = price || ad.price;
      ad.deliveryType = deliveryType || ad.deliveryType;
      ad.condition = condition || ad.condition;
      ad.category = category || ad.category;
      ad.subCategory = subCategory || ad.subCategory;
      ad.instrument = category === "инструмент" ? instrument : ad.instrument;
      ad.technique = category === "музикална техника" ? technique : ad.technique;

      // Merge remaining images with new uploads to update the ad's images
      const updatedImages = [...parsedRemainingImages, ...newImagePaths];
      const removedImages = ad.images.filter((imagePath) => !updatedImages.includes(imagePath));

      ad.images = updatedImages;

      // Save the updated ad
      await ad.save();

      // Optionally delete images that are no longer part of the ad
      removedImages.forEach((imagePath) => {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Failed to delete image at ${imagePath}:`, err);
          }
        });
      });

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
// Get All Ads (Public) with Pagination
exports.getAllAds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 20; // Default to 20 ads per page

    // Calculate the number of documents to skip
    const skip = (page - 1) * pageSize;

    // Fetch the ads with pagination
    const ads = await Ad.find({})
      .skip(skip)
      .limit(pageSize);

    // Get total count for pagination metadata
    const totalAds = await Ad.countDocuments();

    res.json({
      data: ads, // Paginated ads
      currentPage: page,
      totalPages: Math.ceil(totalAds / pageSize), // Total number of pages
      totalAds, // Total number of ads in the database
    });
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

// Get Ads by Category and Price Range
exports.getAdByCategoryAndPriceRange = async (req, res) => {
  try {
    const { category } = req.params; // Extract category from route params
    const { minPrice, maxPrice } = req.query; // Extract price range from query params

    // Validate inputs
    if (!minPrice || !maxPrice) {
      return res.status(400).json({ error: "Please provide both minPrice and maxPrice" });
    }

    // Build the query for category and price range
    const query = {
      category,
      price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) },
    };

    // Fetch ads from the database
    const ads = await Ad.find(query);

    // Return the filtered ads
    res.json(ads);
  } catch (error) {
    // Handle errors
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

// Search ads by title
exports.searchAds = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Find ads with titles that match the search query (case-insensitive)
    const ads = await Ad.find({
      title: { $regex: query, $options: 'i' },
    });

    res.json(ads);
  } catch (error) {
    console.error('Error searching ads:', error);
    res.status(500).json({ error: error.message });
  }
};


