import { Request, Response, Router } from "express";

import { Difficulty } from "@prisma/client";
import { ResponseType } from "../types/response.type";

const router = Router();

type difficultyResponse = Response<ResponseType<any>>;

router.get("/", async (req: Request, res: difficultyResponse) => {
  try {
    res.status(200);
    res.send({ message: "OK", data: Difficulty });
  } catch (error) {
    res.status(500);
    res.send({ message: "error", error });
  }
});

export default router;
