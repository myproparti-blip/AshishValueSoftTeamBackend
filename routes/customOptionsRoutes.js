import express from "express";
import { getCustomOptions, addCustomOption, deleteCustomOption } from "../controllers/customOptionsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Health check (no auth required)
router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Custom options route is working" });
});

// Get custom options for a type (auth required - user-specific)
router.get("/:type", authMiddleware, getCustomOptions);

// Add custom option (auth required)
router.post("/:type", authMiddleware, addCustomOption);

// Delete custom option (auth required)
router.delete("/:type/:value", authMiddleware, deleteCustomOption);

export default router;
