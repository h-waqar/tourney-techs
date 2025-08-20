import { Schema, model, models } from "mongoose";

const TournamentStaffSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["owner", "organizer", "manager", "support"],
      required: true,
    },
  },
  { _id: false }
);

const TournamentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    bannerUrl: { type: String },
    location: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isPublic: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    staff: [TournamentStaffSchema],
  },
  { timestamps: true }
);

export const Tournament =
  models.Tournament || model("Tournament", TournamentSchema);
