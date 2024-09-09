import { Request, Response, Router } from "express";
import prisma from "../database/prisma";
import { selectDailyTip } from "../controller/daily-tip.controller";

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

    const ls = formattedDate(selectedDT.lastShownDate ?? tomorrow());

    res.status(200);
    res.send({
      message: "OK",
      data: {
        ...selectedDT,
        lastShownDate: ls,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500);
    res.send({ message: "Internal Server Error", error, data: null });
  }
});

export default router;

const tomorrow = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow;
};

const formattedDate = (date: Date): string => {
  // Get the year, month, and day
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
  let day = String(date.getDate()).padStart(2, "0");

  // Combine in the YYYY-MM-DD format
  let formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};
