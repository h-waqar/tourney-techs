import { Schema, model, models } from "mongoose";

const GameSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Game name is required."],
      unique: true,
      trim: true,
    },

    genre: {
      type: String,
      trim: true,
    },

    platform: {
      type: String,
      enum: ["pc", "console", "mobile", "table"],
      required: true,
    },

    description: {
      type: String,
    },

    rulesUrl: {
      type: String, // Optional URL to PDF or webpage
    },

    icon: {
      type: String, // Cloudinary or external image URL
    },
  },
  { timestamps: true }
);

export const Game = models.Game || model("Game", GameSchema);

// {
//   "name": "Valorant",
//   "genre": "Tactical Shooter",
//   "platform": "pc",
//   "description": "5v5 tactical FPS developed by Riot Games",
//   "rulesUrl": "https://mytourney.com/rules/valorant",
//   "icon": "https://cdn.mytourney.com/icons/valorant.png"
// }
