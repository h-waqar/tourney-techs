import { Schema, model, models } from "mongoose";

const TournamentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tournament name is required."],
      trim: true,
    },

    qr: {
      type: String, // Optional QR code URL or base64
    },

    game: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: [true, "Game ID is required."],
    },

    type: {
      type: String,
      enum: ["single_elimination", "double_elimination", "round_robin"],
      required: [true, "Tournament type is required."],
    },

    teamBased: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required."],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required."],
    },

    minPlayers: {
      type: Number,
      required: [true, "Minimum players per team is required."],
      min: 1,
    },

    maxPlayers: {
      type: Number,
      required: [true, "Maximum players per team is required."],
      min: 1,
    },

    location: {
      type: String,
      required: [true, "Location is required."],
      trim: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    description: {
      type: String,
    },

    bannerUrl: {
      type: String,
    },

    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer ID is required."],
    },

    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Admin ID is required."],
    },
  },
  { timestamps: true }
);

export const Tournament =
  models.Tournament || model("Tournament", TournamentSchema);
