import { Request, Response, Router } from "express";
import { ResponseType } from "../types/response.type";
import prisma from "../database/prisma";

const router = Router();

// TODO: Add type for exercise
type exerciseResponse = Response<ResponseType<any>>;

router.get("/", async (req: Request, res: exerciseResponse) => {
  try {
    const exercise = await prisma.exercise.findMany();

    res.status(200);
    res.send({ message: "OK", data: exercise });
  } catch (error) {
    res.status(500);
    res.send({ message: "error", error });
  }
});

export default router;
