import { Goal, Prisma } from "@prisma/client";
import { Request, Response, Router } from "express";
import { isGoalValid } from "../controller/exercise.controller";
import prisma from "../database/prisma";
import { Exercise } from "../types/exercise.type";
import { ResponseType } from "../types/response.type";

const router = Router();

type getAllExercisesResponse = Response<ResponseType<Exercise[]>>;

router.get("/", async (req: Request, res: getAllExercisesResponse) => {
  try {
    const queryParams = req.query;

    const whereClause: Prisma.ExerciseWhereInput = {};

    if (queryParams?.name) {
      whereClause.name = {
        contains: queryParams.name.toString(),
        mode: "insensitive",
      };
    }
    if (queryParams?.goals) {
      const isValid = isGoalValid(queryParams.goals as Goal);
      if (!isValid) {
        res.status(406);
        res.send({
          message: "error",
          error:
            "Not Acceptable, Invalid goal provided, please provide a valid goal",
        });
        return;
      }

      // if the goal is valid
      whereClause.goals = {
        has: queryParams.goals as Goal,
      };
    }

    const exercise = await prisma.exercise.findMany({
      where: whereClause,
    });

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
