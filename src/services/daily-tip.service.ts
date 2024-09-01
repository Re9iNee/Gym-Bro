import { DailyTip } from "@prisma/client";
import { Prisma } from "@prisma/client";
import prisma from "../database/prisma";

export async function getTodayDailyTip(): Promise<DailyTip | null> {
  return await prisma.dailyTip.findFirst({
    where: { isActive: true },
  });
}

export async function createDailyTip(dt: Prisma.DailyTipCreateInput) {
  try {
    return await prisma.dailyTip.create({ data: dt });
  } catch (e) {
    console.error("error", e);
  }
}
