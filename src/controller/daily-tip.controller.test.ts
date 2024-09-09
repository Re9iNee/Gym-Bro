import { DailyTip } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { dailyTipSchema } from "../types/daily-tip.type";
import { convertToClientType, selectDailyTip } from "./daily-tip.controller";

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
    references: JSON.stringify([
      { title: "something", url: "https://something.com" },
    ]),
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
    references: JSON.stringify([
      { title: "something", url: "https://something.com" },
    ]),
  },
];

describe("Daily Tip controller", () => {
  describe("select daily tip", () => {
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

    it("should return dailyTip if both lastShownDate are null", () => {
      const selectedDT = selectDailyTip([
        { ...dtsMockObject[0], lastShownDate: null },
        { ...dtsMockObject[1], lastShownDate: null },
      ]);

      expect(selectedDT.lastShownDate).toBe(null);
    });

    it("should return dailyTip if both lastShownDate are same date", () => {
      const selectedDT = selectDailyTip([
        { ...dtsMockObject[0], lastShownDate: new Date("2020-01-01") },
        { ...dtsMockObject[1], lastShownDate: new Date("2020-01-01") },
      ]);

      expect(selectedDT.lastShownDate).toStrictEqual(new Date("2020-01-01"));
    });
  });

  it("should transform database response into zod type", () => {
    const dt = dtsMockObject[0];

    const desiredDT = convertToClientType(dt);
    const result = dailyTipSchema.safeParse(desiredDT);
    expect(result.success).toBe(true);
  });
});
