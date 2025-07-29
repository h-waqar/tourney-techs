// src\app\api\tournaments\[id]\route.js

import { asyncHandler } from "@/utils/server/asyncHandler";
import { ApiResponse } from "@/utils/server/ApiResponse";
import { ApiError } from "@/utils/server/ApiError";
import { requireAdmin } from "@/utils/server/roleGuards";
import { parseForm } from "@/utils/server/parseForm";
import { uploadOnCloudinary } from "@/utils/server/cloudinary";
import { Tournament } from "@/models/Tournament";

export const config = {
  api: { bodyParser: false },
};

export const PATCH = asyncHandler(async (req, context) => {
  await requireAdmin(); // Only global admin can update tournaments

  const { id } = context.params;
  const tournament = await Tournament.findById(id);
  if (!tournament) throw new ApiError(404, "Tournament not found");

  const { fields, files } = await parseForm(req);

  const allowedFields = [
    "name",
    "description",
    "location",
    "startDate",
    "endDate",
    "isPublic",
    "status",
  ];

  for (const field of allowedFields) {
    if (fields[field] !== undefined) {
      switch (field) {
        case "startDate":
        case "endDate":
          tournament[field] = new Date(fields[field]);
          break;
        case "isPublic":
          tournament[field] = fields[field] === "false" ? false : true;
          break;
        default:
          tournament[field] = fields[field].toString();
      }
    }
  }

  // Optional: banner update
  const bannerPath = Array.isArray(files.banner)
    ? files.banner[0]?.filepath
    : files.banner?.filepath;

  if (bannerPath) {
    const bannerUpload = await uploadOnCloudinary(
      bannerPath,
      "tournaments/banners"
    );
    tournament.bannerUrl = bannerUpload.secure_url;
  }

  await tournament.save();

  return Response.json(
    new ApiResponse(
      200,
      tournament.toObject(),
      "Tournament updated successfully"
    )
  );
});

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

<<<<<<< Updated upstream
=======
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
    "status",
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

>>>>>>> Stashed changes
// DELETE /api/tournaments/[id]
export const DELETE = asyncHandler(async (req, context) => {
  const authUser = await requireAuth(req);
  const { id } = await context.params;

  await requireTournamentStaff(id, authUser._id, ["owner"]);

  const tournament = await Tournament.findByIdAndDelete(id);

  if (!tournament) throw new ApiError(404, "Tournament not found");

  return Response.json({ message: "Tournament deleted" });
});
