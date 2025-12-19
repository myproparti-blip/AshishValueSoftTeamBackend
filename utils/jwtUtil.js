import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "9f2b7c4d1a5e6f7d8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "1h";

// Use same secret as JWT_SECRET if REFRESH_SECRET not provided
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET;
const REFRESH_EXPIRY = process.env.REFRESH_EXPIRY || "365d"; 

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
    const decoded = jwt.verify(token, REFRESH_SECRET);
    console.log("[verifyRefreshToken] ✅ Token verified successfully");
    return decoded;
  } catch (error) {
    console.error("[verifyRefreshToken] ❌ Verification failed:", error.message);
    console.error("[verifyRefreshToken] Token:", token?.substring(0, 50) + "...");
    console.error("[verifyRefreshToken] Secret used:", REFRESH_SECRET?.substring(0, 20) + "...");
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
