import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { uploadImages, uploadBase64Image, deleteImage } from '../controllers/imageController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Upload multiple images with auth check before multipart parsing
router.post('/upload', authMiddleware, upload.array('images', 10), uploadImages);

// Upload single base64 image
router.post('/upload-base64', authMiddleware, uploadBase64Image);

// Delete image
router.post('/delete', authMiddleware, deleteImage);

export default router;
