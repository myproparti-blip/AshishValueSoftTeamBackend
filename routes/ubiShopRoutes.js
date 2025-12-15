import express from "express";
import multer from "multer";
import { createUbiShop, getUbiShopById, updateUbiShop, managerSubmitUbiShop, requestUbiShopRework, getAllUbiShops, deleteUbiShop, deleteMultipleUbiShops } from "../controllers/ubiShopController.js";
import { authMiddleware, isManagerOrAdmin } from "../middleware/authMiddleware.js";

// FILE UPLOAD HANDLER
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Accept all file types
    cb(null, true);
  }
});

const router = express.Router();

// Create new UbiShop
router.post("", authMiddleware, createUbiShop);

// Get all UbiShops (with role-based filtering)
router.get("", authMiddleware, getAllUbiShops);

// Get by ID
router.get("/:id", authMiddleware, getUbiShopById);

// Update UbiShop (only user can update their own pending form)
// Use a custom middleware to handle FormData with files
router.put(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    upload.any()(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: "File upload error", error: err.message });
      }
      next();
    });
  },
  updateUbiShop
);

// Manager/Admin submit action (approve/reject)
router.post("/:id/manager-submit", authMiddleware, isManagerOrAdmin, managerSubmitUbiShop);

// Manager/Admin request rework (only for approved items)
router.post("/:id/request-rework", authMiddleware, isManagerOrAdmin, requestUbiShopRework);

// Delete multiple UbiShops (must be before single delete)
router.post("/bulk/delete", authMiddleware, deleteMultipleUbiShops);

// Delete single UbiShop
router.delete("/:id", authMiddleware, deleteUbiShop);

export default router;