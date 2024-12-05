import { hash } from "bcryptjs";

export async function hashPassword(pwd: string) {
  return await hash(pwd, 12);
}
