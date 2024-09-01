import { describe, expect, it, vi } from "vitest";
import prisma from "../database/__mocks__/prisma";
import { getTodayDailyTip } from "./daily-tip.service";
import { DailyTip } from "@prisma/client";

vi.mock("../database/prisma");

const successDailyTip: DailyTip = {
  id: 1,
  isActive: true,
  title: "something",
  lastShownDate: null,
  content: "something",
  summary: "something",
  image_url: "https://someting.com",
  video_url: "https://someting.com",
  references: [{ title: "something", url: "https://something.com" }],
};

describe("DailyTip Service", () => {
  it("gets the active todo from db", async () => {
    prisma.dailyTip.findFirst.mockResolvedValue({ ...successDailyTip });

    const dailyTip = await getTodayDailyTip();
    expect(dailyTip).toStrictEqual({ ...successDailyTip });
  });
});
