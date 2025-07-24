// src/app/api/games/[id]/route.js

import { connectDB } from "@/lib/mongoose";
import { Game } from "@/models/Game";
import { asyncHandler } from "@/utils/server/asyncHandler";
import { ApiResponse } from "@/utils/server/ApiResponse";
import { ApiError } from "@/utils/server/ApiError";

// ✅ GET /api/games/:id → Get one game by ID
export const GET = asyncHandler(async (_req, { params }) => {
  await connectDB();

  const game = await Game.findById(params.id).lean();

  if (!game) throw new ApiError(404, "Game not found");

  return Response.json(new ApiResponse(200, game, "Game fetched"));
});

// ✅ PUT /api/games/:id → Update a game
export const PUT = asyncHandler(async (req, { params }) => {
  await connectDB();

  const updates = await req.json();

  const updatedGame = await Game.findByIdAndUpdate(params.id, updates, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updatedGame) throw new ApiError(404, "Game not found");

  return Response.json(
    new ApiResponse(200, updatedGame, "Game updated successfully")
  );
});

// ✅ DELETE /api/games/:id → Delete a game
export const DELETE = asyncHandler(async (_req, { params }) => {
  await connectDB();

  const deletedGame = await Game.findByIdAndDelete(params.id);

  if (!deletedGame) throw new ApiError(404, "Game not found");

  return Response.json(new ApiResponse(200, null, "Game deleted successfully"));
});
