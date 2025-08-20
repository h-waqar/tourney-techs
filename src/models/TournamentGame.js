import { Schema, model, models } from "mongoose";

const TournamentGameSchema = new Schema(
  {
    tournament: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
    entryFee: { type: Number, default: 0 },
    format: {
      type: String,
      enum: ["single_elimination", "double_elimination", "round_robin"],
      required: true,
    },
    teamBased: { type: Boolean, default: true },
    minPlayers: { type: Number, required: true },
    maxPlayers: { type: Number, required: true },
  },
  { timestamps: true }
);

TournamentGameSchema.index({ tournament: 1, game: 1 }, { unique: true });

export const TournamentGame =
  models.TournamentGame || model("TournamentGame", TournamentGameSchema);
