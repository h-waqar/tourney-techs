// /utils/server/tokens.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRY || "7d";

/**
 * Generate a JWT access token for the user
 */
export function generateAccessToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      username: user.username,
    },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

/**
 * Generate a JWT refresh token for the user
 */
export function generateRefreshToken(user) {
  return jwt.sign({ _id: user._id }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

/**
 * Verify a JWT access token
 */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Verify a JWT refresh token
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    return null;
  }
}

/*
Example usage after login/register


import { generateAccessToken, generateRefreshToken } from "@/utils/server/tokens";

const accessToken = generateAccessToken(user);
const refreshToken = generateRefreshToken(user);
*/
