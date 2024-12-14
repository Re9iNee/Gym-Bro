import { Goal } from "@prisma/client";
import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters." })
    .max(20, { message: "Username must be at most 20 characters." }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
      }
    ),
  email: z.string().email({ message: "Invalid email" }),
  // Optional fields
  age: z.number().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
  avatar: z.string().optional(),
  birthday: z.string().date().optional(),
  goals: z.array(z.nativeEnum(Goal)).default([]),
  fav_exercises: z.array(z.any()).default([]),
});

export const registerSchema = userSchema.omit({
  id: true,
});

export const loginSchema = userSchema.pick({
  password: true,
  username: true,
  email: true,
});

export type User = z.infer<typeof userSchema>;
