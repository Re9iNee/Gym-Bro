import { ENUMS } from "./../lib/constants";
import { Request, Response, Router } from "express";
import { ResponseType } from "../types/response.type";

const router = Router();

type getAllEnumsResponse = Response<ResponseType<typeof ENUMS>>;
router.get("/", (req: Request, res: getAllEnumsResponse) => {
  try {
    res.status(200);
    res.send({ message: "OK", data: ENUMS });
  } catch (error) {
    res.status(500);
    res.send({ message: "error", error });
  }
});

export default router;
