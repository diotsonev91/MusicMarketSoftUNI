const express = require("express");
const { createAd, deleteAd, editAd, getAdById, getAllAdsOfUser, getAllAds, getAdByCategoryThenSubcategory } = require("../controllers/ad");
const auth = require("../middleware/auth");

const router = express.Router();

// Protected routes
router.post("/", auth(), createAd);
router.delete("/:id", auth(), deleteAd);
router.put("/:id", auth(), editAd);

// Public routes
router.get("/:id", getAdById);                     // Get Ad by ID (public)
router.get("/all", getAllAds);                         // Get all ads of all users (public)
router.get("/user/:userId/ads", getAllAdsOfUser);      // Get all ads of a specific user (public)
router.get("/category/:category/:subCategory?", getAdByCategoryThenSubcategory); // Get Ads by category/subcategory (public)

module.exports = router;