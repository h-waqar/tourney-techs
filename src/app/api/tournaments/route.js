import { asyncHandler } from "@/utils/server/asyncHandler";
import { ApiResponse } from "@/utils/server/ApiResponse";
import { ApiError } from "@/utils/server/ApiError";
import { requireAdmin } from "@/utils/server/roleGuards";
import { parseForm } from "@/utils/server/parseForm";
import { uploadOnCloudinary } from "@/utils/server/cloudinary";

import { Tournament } from "@/models/Tournament";
import { TournamentGame } from "@/models/TournamentGame";

// Disable body parsing for file uploads
export const config = { api: { bodyParser: false } };

// ✅ POST /api/tournaments → Create a new tournament
export const POST = asyncHandler(async (req) => {
  const user = await requireAdmin(); // Only admin can create

  const { fields, files } = await parseForm(req);

  const name = fields.name?.toString();
  const description = fields.description?.toString() || "";
  const location = fields.location?.toString();
  const startDate = new Date(fields.startDate);
  const endDate = new Date(fields.endDate);
  const isPublic = fields.isPublic !== "false"; // default true

  const games = JSON.parse(fields.games || "[]"); // array of { game: ObjectId, format, teamBased, minPlayers, maxPlayers }

  if (!name || !location || isNaN(startDate) || isNaN(endDate)) {
    throw new ApiError(400, "Missing required fields");
  }

  if (!Array.isArray(games) || games.length === 0) {
    throw new ApiError(400, "At least one game is required");
  }

  // Upload banner if provided
  const bannerPath = Array.isArray(files.banner)
    ? files.banner[0]?.filepath
    : files.banner?.filepath;
  const bannerUpload = bannerPath
    ? await uploadOnCloudinary(bannerPath, "tournaments/banners")
    : null;

  // Create tournament
  const tournament = await Tournament.create({
    name,
    description,
    bannerUrl: bannerUpload?.secure_url || "",
    location,
    startDate,
    endDate,
    isPublic,
    status: "upcoming",
    staff: [{ user: user._id, role: "owner" }],
  });

  // Create TournamentGame entries
  const tournamentGames = await Promise.all(
    games.map((g) =>
      TournamentGame.create({
        tournament: tournament._id,
        game: g.game,
        entryFee: g.entryFee || 0,
        format: g.format,
        teamBased: g.teamBased,
        minPlayers: g.minPlayers,
        maxPlayers: g.maxPlayers,
      })
    )
  );

  return Response.json(
    new ApiResponse(
      201,
      { tournament, games: tournamentGames },
      "Tournament created successfully"
    )
  );
});

// ✅ GET /api/tournaments → Fetch all tournaments with games
export const GET = asyncHandler(async () => {
  const tournaments = await Tournament.find().sort({ createdAt: -1 }).lean();

  // fetch games for each tournament
  const tournamentsWithGames = await Promise.all(
    tournaments.map(async (t) => {
      const games = await TournamentGame.find({ tournament: t._id })
        .populate("game", "name icon")
        .lean();
      return { ...t, games };
    })
  );

  return Response.json(
    new ApiResponse(
      200,
      tournamentsWithGames,
      "Tournaments fetched successfully"
    )
  );
});
