import { DailyTip } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import prisma from "../database/__mocks__/prisma";
import { createDailyTip, getTodayDailyTip } from "./daily-tip.service";

vi.mock("../database/prisma");

const dtMockObject: Omit<DailyTip, "id"> = {
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
  it("gets the active dailyTip from db", async () => {
    prisma.dailyTip.findFirst.mockResolvedValue({ ...dtMockObject, id: 1 });

    const dailyTip = await getTodayDailyTip();

    expect(dailyTip).toStrictEqual({ ...dtMockObject, id: 1 });
  });

  it("should create dailyTip", async () => {
    prisma.dailyTip.create.mockResolvedValue({ ...dtMockObject, id: 1 });

    const dailyTip = await createDailyTip(
      JSON.parse(JSON.stringify(dtMockObject))
    );

    expect(dailyTip).toStrictEqual({ ...dtMockObject, id: 1 });
  });

  it.todo("Should get all the dailyTips");
  it.todo(
    "Should call update with selected id and given isActive: true, lastShownDate: tomorrow()"
  );
  it.todo("should call update with prevSelected id and given isActive: false.");
});
