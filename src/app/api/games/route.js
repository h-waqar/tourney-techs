import { connectDB } from "@/lib/mongoose";
import { Game } from "@/models/Game";
import { parseForm } from "@/utils/server/parseForm";
import { uploadOnCloudinary } from "@/utils/server/cloudinary";
import { asyncHandler } from "@/utils/server/asyncHandler";
import { ApiResponse } from "@/utils/server/ApiResponse";
import { ApiError } from "@/utils/server/ApiError";

// Disable default body parser to allow parsing multipart/form-data (for file uploads)
export const config = {
  api: {
    bodyParser: false,
  },
};

// POST /api/games
export const POST = asyncHandler(async (req) => {
  // Connect to MongoDB
  await connectDB();

  // Parse incoming form-data (text + files)
  const { fields, files } = await parseForm(req);

  // Extract and normalize string fields
  const name = fields.name?.toString();
  const genre = fields.genre?.toString();
  const platform = fields.platform?.toString();
  const description = fields.description?.toString();
  const rulesUrl = fields.rulesUrl?.toString();

  // Validate required fields
  if (!name || !platform) {
    throw new ApiError(400, "Game name and platform are required.");
  }

  // Extract file paths from uploaded files
  const iconPath = Array.isArray(files.icon)
    ? files.icon[0]?.filepath
    : files.icon?.filepath;

  const coverPath = Array.isArray(files.coverImage)
    ? files.coverImage[0]?.filepath
    : files.coverImage?.filepath;

  // Upload files to Cloudinary (if provided)
  const iconUpload = iconPath
    ? await uploadOnCloudinary(iconPath, "games/icons")
    : null;

  const coverUpload = coverPath
    ? await uploadOnCloudinary(coverPath, "games/covers")
    : null;

  // Create the game entry in the database
  const createdGame = await Game.create({
    name,
    genre,
    platform,
    description,
    rulesUrl,
    icon: iconUpload?.secure_url || "",
    coverImage: coverUpload?.secure_url || "",
  });

  // Fetch the newly created game from the database to ensure it's saved and get the full object
  const fullGame = await Game.findById(createdGame._id).lean();

  // Return the complete game object including _id
  return Response.json(
    new ApiResponse(201, fullGame, "Game created successfully")
  );
});

// GET /api/games → Return all games
export const GET = asyncHandler(async () => {
  await connectDB();

  const games = await Game.find()
    .sort({ createdAt: -1 }) // newest first
    .lean();

  return Response.json(
    new ApiResponse(200, games, "Games fetched successfully")
  );
});
