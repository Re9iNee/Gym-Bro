import { Request, Response, Router } from "express";
import { ResponseType } from "../types/response.type";
import prisma from "../database/prisma";
import { Exercise } from "../types/exercise.type";

const router = Router();

type getAllExercisesResponse = Response<ResponseType<Exercise[]>>;

router.get("/", async (req: Request, res: getAllExercisesResponse) => {
  try {
    const exercise = await prisma.exercise.findMany();

    res.status(200);
    res.send({ message: "OK", data: exercise });
  } catch (error) {
    res.status(500);
    res.send({ message: "error", error });
  }
});

type getSingleExerciseResponse = Response<ResponseType<Exercise>>;

router.get("/:id", async (req: Request, res: getSingleExerciseResponse) => {
  try {
    const { id } = req.params;
    const exercise = await prisma.exercise.findUnique({
      where: { id: +id },
    });

    if (!exercise) {
      res.status(404);
      res.send({ message: "error", error: "Exercise not found" });
      return;
    }

    res.status(200);
    res.send({ message: "OK", data: exercise });
  } catch (error) {
    res.status(500);
    res.send({ message: "error", error });
  }
});

export default router;
