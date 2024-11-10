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

type dailyTipResponse = Response<ResponseType<DailyTip>>;

router.get("/", async (req: Request, res: dailyTipResponse) => {
  try {
    const dailyTip = await prisma.dailyTip.findFirstOrThrow({
      where: { isActive: true },
    });

    const convertedDT = convertToClientType(dailyTip);

    res.status(200);
    res.send({ message: "OK", data: convertedDT });
  } catch (error) {
    res.status(500);
    res.send({ message: "error", error });
  }
});

router.patch("/assign", async (req: Request, res: Response) => {
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

    res.status(200);
    res.send({ message: "OK", data: selectedDT, error: null });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({ message: "Internal Server Error", error, data: null });
  }
});

router.get("/test", async (req: Request, res: Response) => {
  try {
    const createdDT = await prisma.dailyTip.create({
      data: {
        content: "test",
        isActive: false,
        lastShownDate: null,
        title: "Test",
        image_url:
          "https://images.unsplash.com/photo-1626820000000-4b3b3b3b3b3b",
        references: [{ title: "Test", url: "https://www.google.com" }],
        video_url: "https://www.youtube.com/watch?v=6ZfuNTqbHE8",
        summary: "Test",
      },
    });

    res.status(200);
    res.send({ message: "OK", data: createdDT });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({ message: "Internal Server Error", error, data: null });
  }
});

export default router;
