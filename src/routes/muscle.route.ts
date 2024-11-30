import { Request, Response, Router } from "express";

import { Muscle } from "@prisma/client";
import { EnumToType } from "../types/generics.type";
import { ResponseType } from "../types/response.type";

const router = Router();

type MuscleT = EnumToType<typeof Muscle>;
type muscleResponse = Response<ResponseType<MuscleT[]>>;

router.get("/", async (req: Request, res: muscleResponse) => {
  try {
    const muscles: Muscle[] = Object.values(Muscle);

    res.status(200);
    res.send({ message: "OK", data: muscles });
  } catch (error) {
    res.status(500);
    res.send({ message: "error", error });
  }
});

export default router;
