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

  describe("GET /daily-tip/assign", () => {
    it("should return todays daily tip", async () => {
      const allDTs = [
        {
          id: 1,
          isActive: false,
        },
        {
          id: 2,
          isActive: true, // previous active daily tip
        },
      ];

      const selectedDT = allDTs[0];
      const updatedSelectDT = {
        ...selectedDT,
        isActive: true,
        lastShownDate: "MockDate",
      };

      const transactionMock: any = {
        dailyTip: {
          findMany: vi.fn().mockResolvedValueOnce(allDTs),
          update: vi.fn().mockResolvedValueOnce(updatedSelectDT),
        },
      };
      prisma.$transaction.mockImplementationOnce(async (callback) =>
        callback(transactionMock)
      );

      // Act
      const response = await request(app).get("/daily-tip/assign");
      const data = await response.body;

      expect(data).toMatchObject({
        data: { id: 1, isActive: true, lastShownDate: "MockDate" },
        error: null,
        message: "OK",
      });
    });
    it("should call update once if it has no previous active dt", async () => {
      const allDTs = [
        { id: 1, isActive: false },
        { id: 2, isActive: false },
      ];

      const transactionMock: any = {
        dailyTip: {
          findMany: vi.fn().mockResolvedValue(allDTs),
          update: vi.fn(),
        },
      };
      prisma.$transaction.mockImplementationOnce(async (callback) =>
        callback(transactionMock)
      );

      await request(app).get("/daily-tip/assign");

      expect(transactionMock.dailyTip.update).toHaveBeenCalledOnce();
    });
    it("should call update twice (update selectedDT & update previous DT)", async () => {
      // Arrange
      const allDTs = [
        { id: 1, isActive: false },
        { id: 2, isActive: true }, // This is the previous active daily tip
        { id: 3, isActive: false },
      ];

      const selectedDT = allDTs[0];
      const updatedSelectedDT = {
        ...selectedDT,
        isActive: true,
        lastShownDate: "mockDate",
      };

      const transactionMock: any = {
        dailyTip: {
          findMany: vi.fn().mockResolvedValueOnce(allDTs),
          update: vi.fn().mockResolvedValueOnce(updatedSelectedDT),
        },
      };
      prisma.$transaction.mockImplementationOnce(async (callback) =>
        callback(transactionMock)
      );

      // Act
      const response = await request(app).get("/daily-tip/assign");

      // Assert
      expect(transactionMock.dailyTip.findMany).toHaveBeenCalled();
      expect(transactionMock.dailyTip.update).toHaveBeenCalledTimes(2);
    });
  });
});
