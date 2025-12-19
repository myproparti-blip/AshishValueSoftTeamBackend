import { verifyToken } from "../utils/jwtUtil.js";

/**
 * Optional auth middleware - sets req.user if valid JWT token is provided
 * Does NOT fail if no token or invalid token
 */
export const optionalAuthMiddleware = (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verifyToken(token);
        if (decoded) {
          req.user = {
            username: decoded.username,
            role: decoded.role,
            clientId: decoded.clientId
          };
        }
      } catch (e) {
        // Token validation failed, but that's okay - just proceed without user
      }
    }
    next();
  } catch (err) {
    next();
  }
};
