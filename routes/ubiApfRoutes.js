import express from "express";
import multer from "multer";
import {
    createUbiApfForm,
    getUbiApfFormById,
    getAllUbiApfForms,
    updateUbiApfForm,
    managerSubmitUbiApfForm,
    requestReworkUbiApfForm,
    deleteUbiApfForm,
    deleteMultipleUbiApfForms
} from "../controllers/ubiApfController.js";
import { authMiddleware, isManagerOrAdmin } from "../middleware/authMiddleware.js";
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

const router = express.Router();

router.post("", authMiddleware, createUbiApfForm);

router.get("", authMiddleware, getAllUbiApfForms);

// Get by ID
router.get("/:id", authMiddleware, getUbiApfFormById);

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
    updateUbiApfForm
);

// Manager/Admin submit action (approve/reject)
router.post("/:id/manager-submit", authMiddleware, isManagerOrAdmin, managerSubmitUbiApfForm);

// Manager/Admin request rework (only for approved items)
router.post("/:id/request-rework", authMiddleware, isManagerOrAdmin, requestReworkUbiApfForm);

// Delete multiple UBI APF (must be before single delete)
router.post("/bulk/delete", authMiddleware, deleteMultipleUbiApfForms);

// Delete single UBI APF
router.delete("/:id", authMiddleware, deleteUbiApfForm);

export default router;
