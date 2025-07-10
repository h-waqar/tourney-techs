import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { ApiResponse } from "@/utils/server/ApiResponse";
import { ApiError } from "@/utils/server/ApiError";
import { asyncHandler } from "@/utils/server/asyncHandler";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/utils/server/tokens.js";

export const POST = asyncHandler(async (req) => {
  await connectDB();

  const body = await req.json();
  const {
    firstname,
    lastname,
    email,
    username,
    password,
    city,
    stateCode,
    dob,
    phone,
    gender,
    avatar, // ✅ optional field
  } = body;

  // ✅ Validate required fields
  if (
    !firstname ||
    !lastname ||
    !email ||
    !username ||
    !password ||
    !city ||
    !stateCode ||
    !dob
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  // 🔍 Check for existing user by email or username
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(409, "Email or username already in use");
  }

  // 🧾 Create new user instance
  const user = new User({
    firstname,
    lastname,
    email,
    username,
    password,
    city,
    stateCode,
    dob,
    phone,
    gender,
    avatar, // ✅ will be undefined if not provided
  });

  await user.save();

  // 🔐 Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // 💾 Save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save();

  // ✅ Return safe user + tokens
  return Response.json(
    new ApiResponse(
      201,
      {
        user: {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          username: user.username,
          avatar: user.avatar || null,
        },
        accessToken,
        refreshToken,
      },
      "User registered successfully"
    )
  );
});
