require("dotenv").config();

if (process.env.NODE_ENV === "production" && !process.env.VERCEL_URL) {
  throw new Error("Missing VERCEL_URL environment variable");
}
export const CLIENT_URL = process.env.VERCEL_URL || "http://localhost:3000";
