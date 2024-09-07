import { Request, Response, Router } from "express";
import prisma from "../database/prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const dailyTip = await prisma.dailyTip.findFirstOrThrow({
      where: { isActive: true },
    });
    res.status(200);
    res.send({ message: "OK", data: dailyTip, error: null });
  } catch (error) {
    res.status(500);
    res.send({ message: "Internal Server Error", error, data: null });
  }
});

export default router;
