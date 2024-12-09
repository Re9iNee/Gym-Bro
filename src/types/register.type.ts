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
});

export const registerSchema = userSchema.pick({
  email: true,
  username: true,
  password: true,
});

export type Register = z.infer<typeof userSchema>;
