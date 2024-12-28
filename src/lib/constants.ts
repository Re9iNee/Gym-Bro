require("dotenv").config();

if (process.env.NODE_ENV === "production" && !process.env.VERCEL_URL) {
  throw new Error("Missing VERCEL_URL environment variable");
}

export const CLIENT_URL = process.env.VERCEL_URL || "http://localhost:3000";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY environment variable");
}

export const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!process.env.POSTGRES_PRISMA_URL) {
  throw new Error("Missing POSTGRES_PRISMA_URL environment variable");
}

export const POSTGRES_PRISMA_URL = process.env.POSTGRES_PRISMA_URL;
