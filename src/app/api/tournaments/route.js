import { connectDB } from "@/lib/mongoose";
import { Tournament } from "@/models/Tournament";
import { ApiResponse } from "@/utils/server/ApiResponse";
import { ApiError } from "@/utils/server/ApiError";
import { asyncHandler } from "@/utils/server/asyncHandler";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roles";

// ✅ GET /api/tournaments → List all tournaments
export const GET = asyncHandler(async () => {
  await connectDB();

  const tournaments = await Tournament.find();

  return Response.json(new ApiResponse(200, tournaments, "Tournament list"));
});

// ✅ POST /api/tournaments → Create new tournament
export const POST = asyncHandler(async (req) => {
  await connectDB();

  const authUser = await requireAuth();
  const user = await requireRole(authUser, "admin");

  const body = await req.json();
  const {
    name,
    qr,
    game,
    type,
    teamBased,
    startDate,
    endDate,
    minPlayers,
    maxPlayers,
    location,
    description,
    bannerUrl,
  } = body;

  // Required fields
  const required = [
    name,
    game,
    type,
    startDate,
    endDate,
    minPlayers,
    maxPlayers,
    location,
  ];
  if (required.some((field) => !field)) {
    throw new ApiError(400, "All required tournament fields must be filled.");
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start) || isNaN(end)) {
    throw new ApiError(400, "Invalid date format.");
  }
  if (start >= end) {
    throw new ApiError(400, "Start date must be before end date.");
  }

  const tournament = await Tournament.create({
    name,
    qr,
    game,
    type,
    teamBased,
    startDate,
    endDate,
    minPlayers,
    maxPlayers,
    location,
    description,
    bannerUrl,
    organizer: user._id,
    admin: user._id,
  });

  return Response.json(
    new ApiResponse(201, tournament, "Tournament created successfully")
  );
});
