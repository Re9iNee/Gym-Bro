import { Request, Response, Router } from "express";
import { ResponseType } from "../types/response.type";
import { Equipment } from "@prisma/client";

const router = Router();

type EquipmentResponseType = Response<ResponseType<Equipment[]>>;
router.get("/", (req: Request, res: EquipmentResponseType) => {
  try {
    const equipment: Equipment[] = Object.values(Equipment);
    res.status(200);
    res.send({ message: "OK", data: equipment });
  } catch (error) {
    res.status(500);
    res.send({ message: "error", error });
  }
});

export default router;
