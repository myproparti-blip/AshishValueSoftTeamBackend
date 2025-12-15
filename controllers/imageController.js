import { uploadImageToCloudinary, uploadBase64ToCloudinary, deleteImageFromCloudinary } from '../utils/cloudinaryHelper.js';


export const uploadImages = async (req, res) => {
    try {
        const { folderPath } = req.body;

        if (!folderPath) {
            return res.status(400).json({ message: 'folderPath is required' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files provided' });
        }

        const uploadedImages = [];
        const errors = [];

        for (const file of req.files) {
            try {
                const result = await uploadImageToCloudinary(
                    file.buffer,
                    folderPath,
                    `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                );

                uploadedImages.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                    fileName: file.originalname,
                    size: file.size,
                    width: result.width,
                    height: result.height
                });
            } catch (error) {
                errors.push({
                    fileName: file.originalname,
                    error: error.message
                });
            }
        }

        if (uploadedImages.length === 0) {
            return res.status(500).json({ 
                message: 'Failed to upload any images',
                errors: errors,
                details: 'Check Cloudinary credentials and account status'
            });
        }

        res.status(201).json({
            message: 'Images uploaded successfully',
            images: uploadedImages
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to upload images', 
            error: error.message 
        });
    }
};

export const uploadBase64Image = async (req, res) => {
    try {
        const { base64String, folderPath, fileName } = req.body;

        if (!base64String || !folderPath) {
            return res.status(400).json({ 
                message: 'base64String and folderPath are required' 
            });
        }

        const result = await uploadBase64ToCloudinary(
            base64String,
            folderPath,
            `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        );

        res.status(201).json({
            message: 'Image uploaded successfully',
            image: {
                url: result.secure_url,
                publicId: result.public_id,
                fileName: fileName || result.public_id,
                width: result.width,
                height: result.height
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to upload image', 
            error: error.message 
        });
    }
};


export const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.body;

        if (!publicId) {
            return res.status(400).json({ message: 'publicId is required' });
        }

        await deleteImageFromCloudinary(publicId);

        res.status(200).json({
            message: 'Image deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to delete image', 
            error: error.message 
        });
    }
};

export const uploadDocuments = async (req, res) => {
    try {
        const { folderPath } = req.body;

        if (!folderPath) {
            return res.status(400).json({ message: 'folderPath is required' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files provided' });
        }

        const uploadedDocuments = [];
        const errors = [];

        for (const file of req.files) {
            try {
                const result = await uploadImageToCloudinary(
                    file.buffer,
                    folderPath,
                    `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                );

                uploadedDocuments.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                    fileName: file.originalname,
                    size: file.size
                });
            } catch (error) {
                errors.push({
                    fileName: file.originalname,
                    error: error.message
                });
            }
        }

        if (uploadedDocuments.length === 0) {
            return res.status(500).json({ 
                message: 'Failed to upload any documents',
                errors: errors,
                details: 'Check Cloudinary credentials and account status'
            });
        }

        res.status(201).json({
            message: 'Documents uploaded successfully',
            documents: uploadedDocuments
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to upload documents', 
            error: error.message 
        });
    }
};
