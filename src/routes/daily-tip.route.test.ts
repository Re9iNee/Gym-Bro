import request from "supertest";
import app from "../app";

import { describe, expect, it, vi } from "vitest";
import prisma from "../database/__mocks__/prisma";
import { dailyTips } from "../lib/placeholder-data";
import { dailyTipSchema } from "../types/daily-tip.type";

vi.mock("../database/prisma");

describe("/daily-tip Routes", () => {
  describe("GET /daily-tip", () => {
    it("should return daily tip of the day", async () => {
      const dailyTip = dailyTips[0];
      prisma.dailyTip.findFirstOrThrow.mockResolvedValue({
        ...dailyTip,
        lastShownDate: new Date("2024-09-11"),
        references: JSON.stringify([
          { title: "something", url: "something.com" },
        ]),
      });
      const response = await request(app).get("/daily-tip");

      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body).toMatchObject({
        message: "OK",
        data: {
          ...dailyTip,
          lastShownDate: "2024-09-11",
          references: [{ title: "something", url: "something.com" }],
        },
      });
    });

    it("should match the schema of daily tip", async () => {
      const dailyTip = dailyTips[0];
      prisma.dailyTip.findFirstOrThrow.mockResolvedValue(dailyTip);
      const response = await request(app).get("/daily-tip");

      const parsedResult = dailyTipSchema.safeParse(response.body.data);

      expect(parsedResult.success).toBe(true);
    });
  });
});

describe("PATCH /assign-daily-tip", () => {
  it("should assign and return todays daily tip", async () => {
    const selectedDT = dailyTips[2];

    prisma.$transaction.mockResolvedValue({
      ...selectedDT,
      isActive: true,
      lastShownDate: new Date("2024-09-11"),
      references: JSON.stringify([
        { title: "something", url: "something.com" },
      ]),
    });

    const response = await request(app).patch("/daily-tip/assign");

    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");

    expect(response.body).toMatchObject({
      message: "OK",
      data: {
        ...selectedDT,
        isActive: true,
        lastShownDate: "2024-09-11",
        references: [{ title: "something", url: "something.com" }],
      },
    });
  });

  it.todo("should call findMany once");
  it.todo("should call update method twice");
  it.todo("make sure the response the type of response type (zod) and message");
});
