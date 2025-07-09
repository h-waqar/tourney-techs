import { Schema, model, models } from "mongoose";

const TeamSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required."],
      unique: true,
      trim: true,
    },

    logo: {
      type: String, // URL or Cloudinary path
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Team = models.Team || model("Team", TeamSchema);
