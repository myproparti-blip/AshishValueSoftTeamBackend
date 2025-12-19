import { verifyToken } from "../utils/jwtUtil.js";

/**
 * Middleware to validate user from JWT token or legacy auth methods
 * Supports multiple formats (checked in priority order):
 * 1. JWT Token in Authorization header: "Bearer <jwt-token>"
 * 2. Request body: { username, userRole, clientId }
 * 3. Query parameters: ?username=user&userRole=role&clientId=id
 * 4. Legacy bearerToken in Authorization header: base64 or URL-encoded JSON
 */

export const authMiddleware = (req, res, next) => {
  try {
    let user = null;

    // ---------------------------------------
    // PRIORITY 1 — Allow AI API KEY
    // ---------------------------------------
    const apiKey = "sk-297a7af14b3748c7abeff952989a8468";

    if (req.headers.authorization === apiKey) {
      req.user = {
        username: "ai-system",
        role: "admin",
        clientId: "system"
      };
      return next();
    }

    // ---------------------------------------
    // PRIORITY 2 — JWT Token
    // ---------------------------------------
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = verifyToken(token);

        if (decoded) {
          user = {
            username: decoded.username,
            role: decoded.role,
            clientId: decoded.clientId
          };
        } else {
          // Token is expired or invalid - return 401
          console.log("[authMiddleware] JWT token is invalid or expired");
          return res.status(401).json({ message: "Unauthorized - Token expired or invalid" });
        }
      } catch (e) {
        console.error("[authMiddleware] JWT verification error:", e.message);
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      }
    }

    // ---------------------------------------
    // PRIORITY 3 — Body fallback
    // ---------------------------------------
    if (!user && req.body.username && (req.body.role || req.body.userRole) && req.body.clientId) {
      user = {
        username: req.body.username,
        role: req.body.role || req.body.userRole,
        clientId: req.body.clientId
      };
    }

    // ---------------------------------------
    // PRIORITY 4 — Query fallback
    // ---------------------------------------
    if (!user && req.query.username && req.query.clientId) {
      user = {
        username: req.query.username,
        role: req.query.role || "user",
        clientId: req.query.clientId
      };
    }

    // Final validation
    if (!user) {
      console.log("[authMiddleware] No user found. Auth header:", req.headers.authorization?.substring(0, 30));
      return res.status(401).json({ message: "Unauthorized - Missing user information" });
    }

    if (!user.username || !user.role || !user.clientId) {
      console.log("[authMiddleware] Invalid user fields:", { username: user.username, role: user.role, clientId: user.clientId });
      return res.status(401).json({ message: "Unauthorized - Invalid user fields" });
    }
    
    console.log("[authMiddleware] ✅ Auth successful for user:", user.username);

    req.user = user;
    next();
    
  } catch (err) {
    return res.status(500).json({ message: "Authentication error: " + err.message });
  }
};

/**
 * Check if user is manager or admin
 * Compatible with new role system where manager role is used instead of manager1/manager2
 */
export const isManagerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - No user found" });
  }
  if (req.user.role !== "manager" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Only manager or admin can perform this action" });
  }
  
  next();
};

/**
 * Check if user is admin
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - No user found" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Only admin can perform this action" });
  }
  next();
};
