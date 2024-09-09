import { Request, Response, Router } from "express";
import {
  convertToClientType,
  selectDailyTip,
} from "../controller/daily-tip.controller";
import prisma from "../database/prisma";
import { tomorrow } from "../lib/utils/date.utils";
import { DailyTip } from "../types/daily-tip.type";
import { ResponseType } from "../types/response.type";

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

router.patch("/assign", async (_, res: Response<ResponseType<DailyTip>>) => {
  try {
    const selectedDT = await prisma.$transaction(async (tx) => {
      const dailyTips = await tx.dailyTip.findMany();
      const previousDT = dailyTips.find((dt) => dt.isActive);

      const selected = selectDailyTip(dailyTips);
      const updatedSelected = await tx.dailyTip.update({
        where: { id: selected.id },
        data: { isActive: true, lastShownDate: tomorrow() },
      });

      if (previousDT) {
        await tx.dailyTip.update({
          where: { id: previousDT.id },
          data: { isActive: false },
        });
      }

      return updatedSelected;
    });

    const convertedDT = convertToClientType(selectedDT);

    res.status(200);
    res.send({
      message: "OK",
      data: convertedDT,
    });
  } catch (error) {
    console.error(error);

    res.status(500);
    res.send({ message: "error", error });
  }
});

export default router;
