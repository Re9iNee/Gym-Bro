import { hash } from "bcryptjs";
import crypto from "crypto";

export async function hashPassword(pwd: string) {
  return await hash(pwd, 12);
}

export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}
