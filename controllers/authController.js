import { authenticateUser } from "../models/clientUsersModel.js";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwtUtil.js";

// Keep existing login
export const login = (req, res) => {
  const { clientId, username, password } = req.body;

  if (!clientId || !username || !password) {
    return res.status(400).json({ message: "ClientId, username, and password are required" });
  }

  const user = authenticateUser(clientId, username, password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials. Please check your clientId, username, and password." });
  }

  const payload = {
    username: user.username,
    role: user.role,
    clientId: user.clientId,
  };

  const jwtToken = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.status(200).json({
    message: "Sign in successful",
    role: user.role,
    username: user.username,
    clientId: user.clientId,
    token: jwtToken,
    refreshToken: refreshToken,
  });
};

// Refresh token endpoint
export const refreshTokenEndpoint = (req, res) => {
  try {
    const { refreshToken } = req.body;
    console.log("[refreshTokenEndpoint] Received refresh token request");
    console.log("[refreshTokenEndpoint] Refresh token:", refreshToken?.substring(0, 50) + "...");

    if (!refreshToken) {
      console.log("[refreshTokenEndpoint] Missing refresh token in request body");
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    console.log("[refreshTokenEndpoint] Decoded refresh token:", decoded);
    
    if (!decoded) {
      console.log("[refreshTokenEndpoint] Invalid or expired refresh token");
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    const payload = {
      username: decoded.username,
      role: decoded.role,
      clientId: decoded.clientId,
    };

    const newJwtToken = generateToken(payload);
    console.log("[refreshTokenEndpoint] ✅ Token refreshed successfully for user:", payload.username);

    res.status(200).json({
      message: "Token refreshed successfully",
      token: newJwtToken,
    });
  } catch (error) {
    console.error("[refreshTokenEndpoint] ❌ Error:", error.message);
    res.status(500).json({ message: "Token refresh failed", error: error.message });
  }
};

// Logout endpoint
export const logout = (req, res) => {
  // Handle logout with or without user session
  const username = req.user?.username || "unknown";
  const clientId = req.user?.clientId || "unknown";
  
  res.status(200).json({
    message: "Logout successful",
    username,
    clientId,
  });
};
