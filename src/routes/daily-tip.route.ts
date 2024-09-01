import { Request, Response, Router } from "express";
import { dailyTips } from "../lib/placeholder-data";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200);
  res.send({ ...dailyTips[0] });
});

export default router;
