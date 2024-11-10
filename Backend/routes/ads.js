const express = require("express");
const { createAd, deleteAd, editAd, getAdById, getAllAdsOfUser, getAllAds, getAdByCategoryThenSubcategory,  getAdByPriceRange,
    getAdByCategoryThenSubcategoryThenPriceRange } = require("../controllers/ad");
const auth = require("../middleware/auth");

const router = express.Router();

// Protected routes
router.post("/", auth(), createAd);
router.delete("/:id", auth(), deleteAd);
router.put("/:id", auth(), editAd);

// Public routes
router.get("/price-range", getAdByPriceRange); // Ads by price range ?minPrice=50&maxPrice=300
router.get("/category/:category/:subCategory?/price-range", getAdByCategoryThenSubcategoryThenPriceRange); // Ads by category, subcategory, and price range
router.get("/category/:category/:subCategory?", getAdByCategoryThenSubcategory); // Get Ads by category/subcategory (public)
router.get("/user/:userId/ads", getAllAdsOfUser);      // Get all ads of a specific user (public)
router.get("/", getAllAds);                         // Get all ads of all users (public)
router.get("/:id", getAdById);                     // Get Ad by ID (public)

module.exports = router;