// src\models\BracketGroup.js

import { Schema, model, models } from "mongoose";

const BracketGroupSchema = new Schema(
  {
    tournament: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true },
    bracketSide: { type: String, enum: ["winner", "loser"], default: "winner" },
  },
  { timestamps: true }
);

BracketGroupSchema.index({ tournament: 1, game: 1, name: 1 }, { unique: true });

export const BracketGroup =
  models.BracketGroup || model("BracketGroup", BracketGroupSchema);
// src\models\Club.js

import { Schema, model, models } from "mongoose";

const ClubSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Club name is required."],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    logo: {
      type: String, // image URL or Cloudinary path
    },

    city: {
      type: String,
      required: [true, "City is required."],
    },

    state: {
      type: String,
      required: [true, "State is required."],
    },
  },
  { timestamps: true }
);

export const Club = models.Club || model("Club", ClubSchema);
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
// src\models\Game.js

import { Schema, model, models } from "mongoose";

const GameSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    genre: { type: String, trim: true },
    platform: {
      type: String,
      enum: ["pc", "console", "mobile", "table"],
      required: true,
    },
    description: { type: String },
    rulesUrl: { type: String },
    icon: { type: String },
    coverImage: { type: String },
  },
  { timestamps: true }
);

export const Game = models.Game || model("Game", GameSchema);
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
import { Schema, model, models } from "mongoose";

const MatchSchema = new Schema(
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
    matchNumber: { type: Number, required: true },
    bracketGroup: { type: Schema.Types.ObjectId, ref: "BracketGroup" },
    round: { type: Number, required: true },
    qr: { type: String },
    teamA: { type: Schema.Types.ObjectId, ref: "Team" },
    teamB: { type: Schema.Types.ObjectId, ref: "Team" },
    winner: { type: Schema.Types.ObjectId, ref: "Team" },
    loser: { type: Schema.Types.ObjectId, ref: "Team" },
    score: {
      teamA: { type: Number, default: 0 },
      teamB: { type: Number, default: 0 },
    },
    bestOf: { type: Number, default: 1 }, // best-of-N series
    scheduledAt: { type: Date },
    completedAt: { type: Date },
    nextMatch: { type: Schema.Types.ObjectId, ref: "Match" },
    admin: { type: Schema.Types.ObjectId, ref: "User" },
    events: [
      {
        type: { type: String, enum: ["score", "foul", "pause", "resume"] },
        timestamp: { type: Date, default: Date.now },
        data: Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);

MatchSchema.index(
  { tournament: 1, tournamentGame: 1, matchNumber: 1 },
  { unique: true }
);

export const Match = models.Match || model("Match", MatchSchema);
import { Schema, model, models } from "mongoose";

const TeamSchema = new Schema(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, default: "" },
    captain: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
    club: { type: Schema.Types.ObjectId, ref: "Club" },
    status: {
      type: String,
      enum: ["active", "pending", "disqualified"],
      default: "pending",
    },
    locked: { type: Boolean, default: false },
    autoGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Team = models.Team || model("Team", TeamSchema);
import { Schema, model, models } from "mongoose";

const TeamMemberSchema = new Schema(
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
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

TeamMemberSchema.index(
  { tournament: 1, tournamentGame: 1, team: 1, user: 1 },
  { unique: true }
);

export const TeamMember =
  models.TeamMember || model("TeamMember", TeamMemberSchema);
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
// src\models\User.js

import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const UserSchema = new Schema(
  {
    registrationId: { type: String },

    firstname: {
      type: String,
      required: [true, "First name is required."],
    },

    lastname: {
      type: String,
      required: [true, "Last name is required."],
    },

    avatar: {
      type: String,
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    username: {
      type: String,
      required: [true, "Username is required."],
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required."],
    },

    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\+?\d{10,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      unique: true,
      sparse: true, // Allows multiple users without phone numbers
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    city: {
      type: String,
      required: [true, "City is required."],
    },

    stateCode: {
      type: String,
      required: [true, "State code is required."],
    },

    dob: {
      type: Date,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Date of birth cannot be in the future.",
      },
      required: [true, "DOB is required."],
    },

    refreshToken: { type: String },

    status: {
      type: String,
      enum: ["online", "offline", "idle"],
      default: "offline",
    },

    role: {
      type: String,
      enum: ["player", "admin", "manager"],
      default: "player",
    },
  },
  { timestamps: true }
);

// Password hashing before saving user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare plain password with hashed password
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🧠 Prevent model overwrite in development
export const User = models.User || model("User", UserSchema);
