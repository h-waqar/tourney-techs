import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
      enum: ["player", "admin", "editor"],
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

// Generate JWT access token
UserSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    email: this.email,
    username: this.username,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

// Generate JWT refresh token
UserSchema.methods.generateRefreshToken = function () {
  const payload = { _id: this._id };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

// 🧠 Prevent model overwrite in development
export const User = models.User || model("User", UserSchema);
