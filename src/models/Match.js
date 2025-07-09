import { Schema, model, models } from "mongoose";

const MatchSchema = new Schema(
  {
    tournament: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
        required: [true, "Tournament ID is required."],
    },

    matchNumber: {
      type: Number,
      required: [true, "Match number is required."],
    },

    bracketGroup: {
      type: Schema.Types.ObjectId,
      ref: "BracketGroup", // optional in early stages
    },

    round: {
      type: Number,
      required: [true, "Round number is required."],
    },

    qr: {
      type: String, // optional QR code for check-in
    },

    teamA: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team A ID is required."],
    },

    teamB: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team B ID is required."],
    },

    winner: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },

    loser: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },

    score: {
      type: String, // e.g. "2-1"
    },

    scheduledAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    nextMatch: {
      type: Schema.Types.ObjectId,
      ref: "Match", // For bracket linking
    },

    admin: {
      type: Schema.Types.ObjectId,
      ref: "User", // Optional, match referee
    },
  },
  { timestamps: true }
);

// Index to quickly query tournament matches in order
MatchSchema.index({ tournament: 1, matchNumber: 1 }, { unique: true });

export const Match = models.Match || model("Match", MatchSchema);
