import { Difficulty, Equipment, Focus, Goal, Muscle } from "@prisma/client";
import { z } from "zod";

export const exerciseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  tips: z.array(z.string()),
  steps: z.array(z.string()),
  video_url: z.string().url(),
  image_url: z.string().url(),
  goals: z.array(z.nativeEnum(Goal)),
  difficulty: z.nativeEnum(Difficulty),
  focuses: z.array(z.nativeEnum(Focus)),
  muscles: z.array(z.nativeEnum(Muscle)),
  equipments: z.array(z.nativeEnum(Equipment)),
});

export type Exercise = z.infer<typeof exerciseSchema>;
