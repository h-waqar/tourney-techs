import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/server/tokens";
import { ApiError } from "@/utils/server/ApiError";

/**
 * Protects a route by validating the access token from cookies
 */
export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new ApiError(401, "Access token missing");
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  return decoded; // contains _id, email, username
}
