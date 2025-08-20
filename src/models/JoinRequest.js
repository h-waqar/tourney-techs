import { Schema, model, models } from "mongoose";

const JoinRequestSchema = new Schema(
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
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestType: { type: String, enum: ["invite", "join"], required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    team: { type: Schema.Types.ObjectId, ref: "Team" },
  },
  { timestamps: true }
);

JoinRequestSchema.index(
  { tournament: 1, tournamentGame: 1, team: 1, user: 1, requestType: 1 },
  { unique: true }
);

export const JoinRequest =
  models.JoinRequest || model("JoinRequest", JoinRequestSchema);
