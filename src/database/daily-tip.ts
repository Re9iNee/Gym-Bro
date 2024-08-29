import { DailyTip } from "@prisma/client";
import { prisma } from "./prisma";

export async function getTodayDailyTip(): Promise<DailyTip | null> {
  return await prisma.dailyTip.findFirst({
    where: { isActive: true },
  });
}
