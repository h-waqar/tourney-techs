// ✅ src/utils/server/asyncHandler.js
import { NextResponse } from "next/server";

export const asyncHandler = (handler) => {
  return async (req) => {
    try {
      return await handler(req);
    } catch (error) {
      const status = error.statusCode || 500;
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Internal Server Error",
          errors: error.errors || [],
        },
        { status }
      );
    }
  };
};

/*
import { ApiError } from "@/utils/server/ApiError";
import { ApiResponse } from "@/utils/server/ApiResponse";
import { asyncHandler } from "@/utils/server/asyncHandler";

export const POST = asyncHandler(async (req, res) => {
  const body = await req.json();
  if (!body.email) {
    throw new ApiError(400, "Email is required");
  }

  ... do something

  
    return Response.json(
    new ApiResponse(200, { user }, "User registered successfully")
    );
});



*/
