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
  lastShownDate: z.string().date().nullable(),
});

export type DailyTip = z.infer<typeof dailyTipSchema>;
