// src\app\api\tournaments\[id]\route.js

import { Tournament } from "@/models/Tournament";
import { requireAuth } from "@/utils/server/auth";
import { requireTournamentStaff } from "@/utils/server/tournamentPermissions";
import { asyncHandler } from "@/utils/server/asyncHandler";
import { ApiError } from "@/utils/server/ApiError";

// GET /api/tournaments/[id]
export const GET = asyncHandler(async (req, context) => {
  const { id } = await context.params;

  const tournament = await Tournament.findById(id)
    .populate("games.game")
    .populate("staff.user", "name email")
    .lean();

  if (!tournament) throw new ApiError(404, "Tournament not found");

  return Response.json(tournament);
});

// PATCH /api/tournaments/[id]
export const PATCH = asyncHandler(async (req, context) => {
  const authUser = await requireAuth(req);
  const { id } = await context.params;

  await requireTournamentStaff(id, authUser._id, ["owner", "organizer"]);

  const data = await req.json();

  const allowedFields = [
    "name",
    "description",
    "bannerUrl",
    "location",
    "startDate",
    "endDate",
    "games",
    "isPublic",
  ];

  const update = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) update[key] = data[key];
  }

  if (Object.keys(update).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  const tournament = await Tournament.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true }
  );

  if (!tournament) throw new ApiError(404, "Tournament not found");

  return Response.json({ message: "Tournament updated", tournament });
});

// DELETE /api/tournaments/[id]
export const DELETE = asyncHandler(async (req, context) => {
  const authUser = await requireAuth(req);
  const { id } = await context.params;

  await requireTournamentStaff(id, authUser._id, ["owner"]);

  const tournament = await Tournament.findByIdAndDelete(id);

  if (!tournament) throw new ApiError(404, "Tournament not found");

  return Response.json({ message: "Tournament deleted" });
});
