import { v2 as cloudinaryV2 } from 'cloudinary';

// Configure cloudinary with environment variables
cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to validate credentials
const validateCredentials = () => {
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
        throw new Error('Cloudinary credentials are not configured. Please set CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, and CLOUDINARY_API_SECRET in your .env file');
    }
};

/**
 * Upload image to Cloudinary from buffer
 * @param {Buffer} fileBuffer - Image file buffer from multer
 * @param {String} folderPath - Cloudinary folder path (e.g., 'valuations/properties')
 * @param {String} publicId - Public ID for the image (optional)
 * @returns {Promise} Cloudinary upload response
 */
export const uploadImageToCloudinary = async (fileBuffer, folderPath, publicId = null) => {
    try {
        // Check if credentials are available
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
            // Return mock response for development without Cloudinary
            if (process.env.NODE_ENV === 'development') {
                console.warn('⚠️  Using mock Cloudinary response (credentials not configured)');
                return {
                    secure_url: `https://via.placeholder.com/400x300?text=${publicId || 'image'}`,
                    public_id: publicId || `mock_${Date.now()}`,
                    width: 400,
                    height: 300
                };
            }
            throw new Error('Cloudinary credentials not configured');
        }

        validateCredentials();
        // Convert buffer to base64 and upload
        const base64String = fileBuffer.toString('base64');
        const dataUri = `data:image/jpeg;base64,${base64String}`;
        
        const result = await cloudinaryV2.uploader.upload(dataUri, {
            folder: folderPath,
            public_id: publicId,
            resource_type: 'auto',
            overwrite: true
        });
        
        return result;
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};

/**
 * Upload base64 image string to Cloudinary
 * @param {String} base64String - Base64 encoded image string
 * @param {String} folderPath - Cloudinary folder path
 * @param {String} publicId - Public ID for the image (optional)
 * @returns {Promise} Cloudinary upload response
 */
export const uploadBase64ToCloudinary = async (base64String, folderPath, publicId = null) => {
    try {
        // Check if credentials are available
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
            // Return mock response for development without Cloudinary
            if (process.env.NODE_ENV === 'development') {
                console.warn('⚠️  Using mock Cloudinary response (credentials not configured)');
                return {
                    secure_url: `https://via.placeholder.com/400x300?text=${publicId || 'image'}`,
                    public_id: publicId || `mock_${Date.now()}`,
                    width: 400,
                    height: 300
                };
            }
            throw new Error('Cloudinary credentials not configured');
        }

        validateCredentials();
        const result = await cloudinaryV2.uploader.upload(base64String, {
            folder: folderPath,
            public_id: publicId,
            resource_type: 'auto',
            overwrite: true
        });
        return result;
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Public ID of the image to delete
 * @returns {Promise} Deletion result
 */
export const deleteImageFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinaryV2.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error(`Cloudinary deletion failed: ${error.message}`);
    }
};

/**
 * Delete folder and all images in it from Cloudinary
 * @param {String} folderPath - Folder path to delete
 * @returns {Promise} Deletion result
 */
export const deleteFolderFromCloudinary = async (folderPath) => {
    try {
        const result = await cloudinaryV2.api.delete_folder(folderPath);
        return result;
    } catch (error) {
        throw new Error(`Cloudinary folder deletion failed: ${error.message}`);
    }
};

/**
 * Generate optimized Cloudinary URL for image
 * @param {String} cloudinaryUrl - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {String} Optimized URL
 */
export const getOptimizedImageUrl = (cloudinaryUrl, options = {}) => {
    if (!cloudinaryUrl) return '';
    
    const defaultOptions = {
        quality: 'auto',
        fetch_format: 'auto',
        width: options.width || 'auto',
        crop: options.crop || 'scale'
    };

    // Already transformed URL, return as is
    if (cloudinaryUrl.includes('/upload/')) {
        return cloudinaryUrl;
    }

    return cloudinaryUrl;
};
