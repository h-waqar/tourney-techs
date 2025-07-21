// import { requireAuth } from "./auth";
import { ApiError } from "@/utils/server/ApiError";

/**
 * Enforces that user has one of the allowed roles.
 * @param {user} userInfo - The user information object.
 * @param {string|string[]} roles - Single role or array of allowed roles.
 */
export async function requireRole(userInfo, roles = []) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  const { User } = await import("@/models/User");
  const user = await User.findById(userInfo._id).select(
    "-password -refreshToken -__v"
  );

  if (!user || !allowedRoles.includes(user.role)) {
    throw new ApiError(403, "Access denied: Insufficient permissions");
  }

  return user;
}
