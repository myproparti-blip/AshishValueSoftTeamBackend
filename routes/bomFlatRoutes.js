import express from "express";
import multer from "multer";
import {
    createBofMaharashtra,
    getBofMaharastraById,
    getAllBofMaharashtra,
    updateBofMaharashtra,
    managerSubmitBofMaharashtra,
    requestReworkBofMaharashtra,
    deleteBofMaharashtra,
    deleteMultipleBofMaharashtra
} from "../controllers/bomFlatController.js";
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

// Create new BOF Maharashtra form
router.post("", authMiddleware, createBofMaharashtra);

// Get all BOF Maharashtra forms (with role-based filtering)
router.get("", authMiddleware, getAllBofMaharashtra);

// Get by ID
router.get("/:id", authMiddleware, getBofMaharastraById);

// Update BOF Maharashtra form (only user can update their own pending form)
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
    updateBofMaharashtra
);

// Manager/Admin submit action (approve/reject)
router.post("/:id/manager-submit", authMiddleware, isManagerOrAdmin, managerSubmitBofMaharashtra);

// Manager/Admin request rework (only for approved items)
router.post("/:id/request-rework", authMiddleware, isManagerOrAdmin, requestReworkBofMaharashtra);

// Delete multiple BOF Maharashtra (must be before single delete)
router.post("/bulk/delete", authMiddleware, deleteMultipleBofMaharashtra);

// Delete single BOF Maharashtra
router.delete("/:id", authMiddleware, deleteBofMaharashtra);

export default router;
