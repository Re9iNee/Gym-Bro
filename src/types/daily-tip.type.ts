import { z } from "zod";

const referencesSchema = z.object({
  title: z.string(),
  url: z.string().url(),
});

export const dailyTipSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  isActive: z.boolean(),
  image_url: z.string().url(),
  video_url: z.string().url(),
  references: z.array(referencesSchema),
  lastShownDate: z
    .string()
    .nullable()
    .refine(
      (date) => {
        if (date === null) return true; // Skip validation if it's null
        return /^\d{4}-\d{2}-\d{2}$/.test(date); // Validate YYYY-MM-DD format
      },
      {
        message: "Invalid date format. Expected 'YYYY-MM-DD'",
      }
    ),
});

export type DailyTip = z.infer<typeof dailyTipSchema>;
