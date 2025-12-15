import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "9f2b7c4d1a5e6f7d8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "24h";

const REFRESH_SECRET = process.env.REFRESH_SECRET || "9f2b7c4d1a5e6f7d8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a";
const REFRESH_EXPIRY = process.env.REFRESH_EXPIRY || "360d"; 

// Generate access token
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

// Generate refresh token
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
};

// Verify access token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

// Decode JWT without verification
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};
