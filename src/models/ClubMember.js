// src\models\ClubMember.js

import { Schema, model, models } from "mongoose";

const ClubMemberSchema = new Schema(
  {
    club: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["player", "captain", "manager", "coach", "admin", "bench"],
      default: "player",
    },

    status: {
      type: String,
      enum: ["active", "pending", "removed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const ClubMember =
  models.ClubMember || model("ClubMember", ClubMemberSchema);
