// /utils/server/asyncHandler.js
export const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    console.error("Unhandled API Error:", error);

    const status = error.statusCode || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Internal Server Error",
      errors: error.errors || [],
    });
  }
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
