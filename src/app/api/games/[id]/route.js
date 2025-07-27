// src/app/api/games/[id]/route.js

import { Game } from "@/models/Game";
import { asyncHandler } from "@/utils/server/asyncHandler";
import { ApiResponse } from "@/utils/server/ApiResponse";
import { ApiError } from "@/utils/server/ApiError";
import { requireAdmin } from "@/utils/server/roleGuards";

// GET /api/games/:id
export const GET = asyncHandler(async (_req, context) => {
  const params = await context.params;

  const { id } = params;

  const game = await Game.findById(id).lean();

  if (!game) throw new ApiError(404, "Game not found");

  return Response.json(new ApiResponse(200, game, "Game fetched"));
});

// PUT /api/games/:id
export const PUT = asyncHandler(async (req, context) => {
  await requireAdmin();

  const updates = await req.json();

  const params = await context.params;

  const { id } = params;

  const updatedGame = await Game.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updatedGame) throw new ApiError(404, "Game not found");

  return Response.json(
    new ApiResponse(200, updatedGame, "Game updated successfully")
  );
});

// DELETE /api/games/:id
export const DELETE = asyncHandler(async (_req, context) => {
  await requireAdmin();

  const params = await context.params;

  const { id } = params;

  const deletedGame = await Game.findByIdAndDelete(id);

  if (!deletedGame) throw new ApiError(404, "Game not found");

  return Response.json(new ApiResponse(200, null, "Game deleted successfully"));
});
