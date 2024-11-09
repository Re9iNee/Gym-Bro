import { DailyTip } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import prisma from "../database/__mocks__/prisma";
import { createDailyTip, getTodayDailyTip } from "./daily-tip.service";
import { dailyTips } from "../lib/placeholder-data";

vi.mock("../database/prisma");

describe("DailyTip Service", () => {
  it("gets the active dailyTip from db", async () => {
    const dailyTip = dailyTips[0];
    prisma.dailyTip.findFirst.mockResolvedValue(dailyTip);

    const dt = await getTodayDailyTip();

    expect(dt).toStrictEqual(dailyTip);
  });

  it("should create dailyTip", async () => {
    const dailyTip = dailyTips[0];
    prisma.dailyTip.create.mockResolvedValue(dailyTip);

    const dt = await createDailyTip(JSON.parse(JSON.stringify(dailyTip)));

    expect(prisma.dailyTip.create).toHaveBeenCalledOnce();
    expect(dt).toStrictEqual(dailyTip);
  });
});
