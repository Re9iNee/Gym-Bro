import { Request, Response, Router } from "express";

import { Difficulty } from "@prisma/client";
import { ResponseType } from "../types/response.type";
import { EnumToType } from "../types/generics.type";

const router = Router();

type DifficultyT = EnumToType<typeof Difficulty>;
type difficultyResponse = Response<ResponseType<DifficultyT[]>>;

router.get("/", async (req: Request, res: difficultyResponse) => {
  try {
    const difficulties: DifficultyT[] = Object.values(Difficulty);

    res.status(200);
    res.send({ message: "OK", data: difficulties });
  } catch (error) {
    res.status(500);
    res.send({ message: "error", error });
  }
});

export default router;
