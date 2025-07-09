import { Schema, model, models } from "mongoose";

const TeamMemberSchema = new Schema(
  {
    tournament: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },

    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 💡 Composite index: One user per tournament
TeamMemberSchema.index({ tournament: 1, user: 1 }, { unique: true });

export const TeamMember =
  models.TeamMember || model("TeamMember", TeamMemberSchema);
