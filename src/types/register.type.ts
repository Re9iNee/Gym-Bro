import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  password: z.string(),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters." })
    .max(20, { message: "Username must be at most 20 characters." }),

  // password: z
  //   .string()
  //   .min(8, { message: "Password must be at least 8 characters." })
  //   .regex(
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //     {
  //       message:
  //         "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  //     }
  //   ),
});

export const registerSchema = userSchema.pick({
  username: true,
  password: true,
});

export type Register = z.infer<typeof userSchema>;
