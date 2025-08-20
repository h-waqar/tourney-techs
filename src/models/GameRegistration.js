import { Schema, model, models } from "mongoose";

const GameRegistrationSchema = new Schema(
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
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    team: { type: Schema.Types.ObjectId, ref: "Team", default: null },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    paid: { type: Boolean, default: false },
    paymentMethod: {
      type: String,
      enum: ["cash", "stripe", "manual"],
      default: "manual",
    },
    paymentDetails: { type: String, trim: true },
    entryFeeSnapshot: { type: Number, required: true },
    totalPaid: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// must have either user OR team
GameRegistrationSchema.pre("validate", function (next) {
  if (!this.user && !this.team) {
    return next(new Error("Either user or team must be provided"));
  }
  next();
});

// unique per user/team per game
GameRegistrationSchema.index(
  { tournament: 1, tournamentGame: 1, user: 1 },
  { unique: true, partialFilterExpression: { user: { $exists: true } } }
);
GameRegistrationSchema.index(
  { tournament: 1, tournamentGame: 1, team: 1 },
  { unique: true, partialFilterExpression: { team: { $exists: true } } }
);

export const GameRegistration =
  models.GameRegistration || model("GameRegistration", GameRegistrationSchema);
