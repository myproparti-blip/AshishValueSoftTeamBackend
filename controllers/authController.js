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

  const jwtToken = generateToken({
    username: user.username,
    role: user.role,
    clientId: user.clientId,
  });

  const refreshToken = generateRefreshToken({
    username: user.username,
    role: user.role,
    clientId: user.clientId,
  });

  res.status(200).json({
    message: "Sign in successful",
    role: user.role,
    username: user.username,
    clientId: user.clientId,
    token: jwtToken,
    refreshToken, // <-- include refresh token in login response
  });
};

// Refresh token endpoint
export const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  const payload = verifyRefreshToken(token);

  if (!payload) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }

  // Generate a new access token
  const newToken = generateToken({
    username: payload.username,
    role: payload.role,
    clientId: payload.clientId,
  });

  res.status(200).json({
    message: "Token refreshed successfully",
    token: newToken,
  });
};

// Keep existing logout
export const logout = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ message: "No user session found" });
  }

  try {
    const userString = decodeURIComponent(authHeader);
    const user = JSON.parse(userString);

    if (!user.username || !user.clientId) {
      return res.status(400).json({ message: "Invalid session information" });
    }

    res.status(200).json({
      message: "Logout successful",
      username: user.username,
      clientId: user.clientId,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid session" });
  }
};
