import { Schema, model, models } from "mongoose";

const MatchSchema = new Schema(
  {
    tournament: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    tournamentGame: {
      type: Schema.Types.ObjectId,
      ref: "TournamentGame",
      required: true,
    },
    matchNumber: { type: Number, required: true },
    bracketGroup: { type: Schema.Types.ObjectId, ref: "BracketGroup" },
    round: { type: Number, required: true },
    qr: { type: String },
    teamA: { type: Schema.Types.ObjectId, ref: "Team" },
    teamB: { type: Schema.Types.ObjectId, ref: "Team" },
    winner: { type: Schema.Types.ObjectId, ref: "Team" },
    loser: { type: Schema.Types.ObjectId, ref: "Team" },
    score: {
      teamA: { type: Number, default: 0 },
      teamB: { type: Number, default: 0 },
    },
    bestOf: { type: Number, default: 1 }, // best-of-N series
    scheduledAt: { type: Date },
    completedAt: { type: Date },
    nextMatch: { type: Schema.Types.ObjectId, ref: "Match" },
    admin: { type: Schema.Types.ObjectId, ref: "User" },
    events: [
      {
        type: { type: String, enum: ["score", "foul", "pause", "resume"] },
        timestamp: { type: Date, default: Date.now },
        data: Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

MatchSchema.index(
  { tournament: 1, tournamentGame: 1, matchNumber: 1 },
  { unique: true }
);

export const Match = models.Match || model("Match", MatchSchema);
