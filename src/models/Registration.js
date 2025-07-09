import { Schema, model, models } from "mongoose";

const RegistrationSchema = new Schema(
  {
    tournament: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: [true, "Tournament ID is required."],
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
    },

    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      // Optional for solo tournaments
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    paid: {
      type: Boolean,
      default: false,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "stripe", "manual"],
      default: "manual",
    },

    paymentDetails: {
      type: String, // Optional details like transaction ID
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate registrations for same user+tournament
RegistrationSchema.index({ tournament: 1, user: 1 }, { unique: true });

export const Registration =
  models.Registration || model("Registration", RegistrationSchema);
