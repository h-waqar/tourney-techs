import { requireAuth } from "./auth";
import { ApiError } from "@/utils/server/ApiError";

/**
 * Enforces that user has one of the allowed roles.
 * @param {string|string[]} roles - Single role or array of allowed roles.
 */
export async function requireRole(roles = []) {
  const decoded = await requireAuth(); // verifies and returns { _id, email, username }

  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  // Fetch full user from DB to check role
  const { User } = await import("@/models/User");
  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );

  if (!user || !allowedRoles.includes(user.role)) {
    throw new ApiError(403, "Access denied: Insufficient permissions");
  }

  return user;
}
