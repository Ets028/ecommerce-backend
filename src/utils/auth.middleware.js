import { verifyToken } from "./auth.util.js";
import { unauthorizedResponse } from "./response.util.js";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    return unauthorizedResponse(res, "Access token required");
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    return unauthorizedResponse(res, "Invalid or expired token");
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorizedResponse(res, "User not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      return unauthorizedResponse(res, "Access denied. Insufficient permissions.");
    }

    next();
  };
};

// Admin-only middleware
export const requireAdmin = authorizeRoles('admin');

// User or Admin middleware
export const requireUserOrAdmin = authorizeRoles('user', 'admin');