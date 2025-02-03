import { Routine, WEEKDAY } from "@prisma/client";
import { Request, Response, Router } from "express";
import { z, ZodError } from "zod";
import prisma from "../database/prisma";
import { ResponseType } from "../types/response.type";

const router = Router();

const queryType = z.object({
  day: z.nativeEnum(WEEKDAY),
  userId: z.string().transform((v) => parseInt(v)),
});

type getAllRoutineResponse = Response<ResponseType<Routine[]>>;
router.get("/", async (req: Request, res: getAllRoutineResponse) => {
  try {
    const query = await queryType.parseAsync(req.query);

    const routines = await prisma.routine.findMany({
      include: { users: true, days: { include: { exercises: true } } },
    });

    res.status(200).json({ message: "OK", data: routines });
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400);
      if (e.flatten().fieldErrors.userId)
        return res.json({ message: "error", error: "userId is required" });
      if (e.flatten().fieldErrors.day)
        return res.json({ message: "error", error: "day is required" });
    }
  }
});

export default router;
