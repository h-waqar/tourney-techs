// src/app/api/tournaments/[id]/route.js

import { connectDB } from "@/lib/mongoose";
import { Tournament } from "@/models/Tournament";
import { ApiResponse } from "@/utils/server/ApiResponse";
import { ApiError } from "@/utils/server/ApiError";
import { asyncHandler } from "@/utils/server/asyncHandler";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roles";
import { parseForm } from "@/utils/server/parseForm";
import { uploadOnCloudinary } from "@/utils/server/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ GET /api/tournaments/:id → View a single tournament
export const GET = asyncHandler(async (_, { params }) => {
  await connectDB();

  const tournament = await Tournament.findById(params.id);

  if (!tournament) {
    throw new ApiError(404, "Tournament not found.");
  }

  return Response.json(new ApiResponse(200, tournament, "Tournament fetched"));
});

// ✅ PATCH /api/tournaments/:id → Update tournament (admin only)
export const PATCH = asyncHandler(async (req, { params }) => {
  await connectDB();

  const authUser = await requireAuth();
  await requireRole(authUser, "admin");

  const { fields, files } = await parseForm(req);
  const updates = {};

  const allowedFields = [
    "name",
    "qr",
    "type",
    "teamBased",
    "startDate",
    "endDate",
    "minPlayers",
    "maxPlayers",
    "location",
    "description",
    "status",
    "bannerUrl",
  ];

  for (const key of allowedFields) {
    if (fields[key]) {
      updates[key] = fields[key].toString();
    }
  }

  const bannerPath = Array.isArray(files.bannerUrl)
    ? files.bannerUrl[0]?.filepath
    : files.bannerUrl?.filepath;

  const qrPath = Array.isArray(files.qr)
    ? files.qr[0]?.filepath
    : files.qr?.filepath;

  if (bannerPath) {
    const bannerUpload = await uploadOnCloudinary(
      bannerPath,
      "tournaments/banners"
    );
    updates.bannerUrl = bannerUpload?.secure_url;
  }

  if (qrPath) {
    const qrUpload = await uploadOnCloudinary(qrPath, "tournaments/qr");
    updates.qr = qrUpload?.secure_url;
  }

  const tournament = await Tournament.findByIdAndUpdate(params.id, updates, {
    new: true,
  });

  if (!tournament) throw new ApiError(404, "Tournament not found.");

  return Response.json(
    new ApiResponse(200, tournament, "Tournament updated successfully")
  );
});

// ✅ DELETE /api/tournaments/:id → Delete tournament (admin only)
export const DELETE = asyncHandler(async (_, { params }) => {
  await connectDB();

  const authUser = await requireAuth();
  await requireRole(authUser, "admin");

  const deleted = await Tournament.findByIdAndDelete(params.id);
  if (!deleted) throw new ApiError(404, "Tournament not found.");

  return Response.json(
    new ApiResponse(200, null, "Tournament deleted successfully")
  );
});
