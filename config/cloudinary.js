import cloudinary from 'cloudinary';

// Configure Cloudinary with environment variables
const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(config);

// Validate configuration on startup (only warn in development)
if (process.env.NODE_ENV === 'development' && (!config.cloud_name || !config.api_key || !config.api_secret)) {
    console.warn('⚠️  WARNING: Cloudinary credentials not configured. Image uploads will fail.');
    console.warn('   Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.development');
}

export default cloudinary;
