import { describe, expect, it } from "vitest";
import { selectDailyTip } from "./daily-tip.controller";
import { DailyTip } from "@prisma/client";

const dtsMockObject: DailyTip[] = [
  {
    id: 1,
    isActive: true,
    title: "something",
    content: "something",
    summary: "something",
    image_url: "https://someting.com",
    video_url: "https://someting.com",
    lastShownDate: new Date("2019-05-02"),
    references: [{ title: "something", url: "https://something.com" }],
  },
  {
    id: 2,
    isActive: true,
    title: "something",
    lastShownDate: null,
    content: "something",
    summary: "something",
    image_url: "https://someting.com",
    video_url: "https://someting.com",
    references: [{ title: "something", url: "https://something.com" }],
  },
];

describe("Daily Tip controller", () => {
  it("should return the dailyTip that it's lastShownDate is null", () => {
    const selectedDT = selectDailyTip([
      { ...dtsMockObject[0], lastShownDate: null },
      { ...dtsMockObject[1], lastShownDate: new Date("2020-05-02") },
    ]);

    expect(selectedDT.lastShownDate).toBe(null);
  });

  it("should select the earliest lastShownDate", () => {
    const selectedDT = selectDailyTip([
      { ...dtsMockObject[0], lastShownDate: new Date("2024-05-20") },
      { ...dtsMockObject[1], lastShownDate: new Date("2020-01-01") },
    ]);

    expect(selectedDT.lastShownDate).toStrictEqual(new Date("2020-01-01"));
  });
});
