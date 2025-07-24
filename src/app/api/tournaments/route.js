import { connectDB } from "@/lib/mongoose";
import { Tournament } from "@/models/Tournament";
import { ApiResponse } from "@/utils/server/ApiResponse";
import { ApiError } from "@/utils/server/ApiError";
import { asyncHandler } from "@/utils/server/asyncHandler";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roles";
import { parseForm } from "@/utils/server/parseForm";
import { uploadOnCloudinary } from "@/utils/server/cloudinary";

// Required for formidable to parse file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ GET /api/tournaments → List all tournaments
export const GET = asyncHandler(async () => {
  await connectDB();

  const tournaments = await Tournament.find();

  return Response.json(new ApiResponse(200, tournaments, "Tournament list"));
});

// ✅ POST /api/tournaments → Create new tournament with file upload
export const POST = asyncHandler(async (req) => {
  await connectDB();

  const authUser = await requireAuth();
  const user = await requireRole(authUser, "admin");

  const { fields, files } = await parseForm(req);

  // 🧼 Extract and clean text fields (formidable returns arrays)
  const cleaned = {
    name: fields.name?.[0],
    game: fields.game?.[0],
    type: fields.type?.[0],
    teamBased: fields.teamBased?.[0] === "true",
    startDate: fields.startDate?.[0],
    endDate: fields.endDate?.[0],
    minPlayers: Number(fields.minPlayers?.[0]),
    maxPlayers: Number(fields.maxPlayers?.[0]),
    location: fields.location?.[0],
    description: fields.description?.[0],
  };

  // ✅ Validate required fields
  const required = [
    cleaned.name,
    cleaned.game,
    cleaned.type,
    cleaned.startDate,
    cleaned.endDate,
    cleaned.minPlayers,
    cleaned.maxPlayers,
    cleaned.location,
  ];
  if (required.some((field) => !field)) {
    throw new ApiError(400, "All required tournament fields must be filled.");
  }

  // 📅 Validate dates
  const start = new Date(cleaned.startDate);
  const end = new Date(cleaned.endDate);
  if (isNaN(start) || isNaN(end)) {
    throw new ApiError(400, "Invalid date format.");
  }
  if (start >= end) {
    throw new ApiError(400, "Start date must be before end date.");
  }

  // ☁️ Upload files to Cloudinary (handles array or single object)
  const qrPath = Array.isArray(files.qr)
    ? files.qr[0]?.filepath
    : files.qr?.filepath;

  const bannerPath = Array.isArray(files.banner)
    ? files.banner[0]?.filepath
    : files.banner?.filepath;

  const qrUpload = qrPath
    ? await uploadOnCloudinary(qrPath, "tournaments/qr")
    : null;

  const bannerUpload = bannerPath
    ? await uploadOnCloudinary(bannerPath, "tournaments/banners")
    : null;

  // 🧾 Create tournament in DB
  const tournament = await Tournament.create({
    ...cleaned,
    qr: qrUpload?.secure_url || "",
    bannerUrl: bannerUpload?.secure_url || "",
    organizer: user._id,
    admin: [user._id],
  });

  return Response.json(
    new ApiResponse(201, tournament, "Tournament created successfully")
  );
});
