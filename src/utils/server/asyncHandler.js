// ✅ src/utils/server/asyncHandler.js
import { NextResponse } from "next/server";

export const asyncHandler = (handler) => {
  return async (req) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error("🔥 Unhandled API Error:", error);

      const status = error.statusCode || 500;

      return NextResponse.json(
        {
          success: false,
          message: error.message || "Internal Server Error",
          errors: error.errors || [],
        },
        { status } // ✅ This sets the status code correctly
      );
    }
  };
};
