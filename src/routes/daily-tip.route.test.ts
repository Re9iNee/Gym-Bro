import request from "supertest";
import app from "../app";

import { DailyTip } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../database/__mocks__/prisma";
import { dailyTipSchema } from "../types/daily-tip.type";

vi.mock("../database/prisma");

const dtMockObject: DailyTip = {
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

describe("/daily-tip Routes", () => {
  describe("GET /daily-tip", () => {
    beforeEach(() => {
      prisma.dailyTip.findFirstOrThrow.mockResolvedValue(dtMockObject);
    });

    it("should return daily tip of the day", async () => {
      const response = await request(app).get("/daily-tip");

      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body).toMatchObject({
        data: dtMockObject,
        error: null,
        message: "OK",
      });
    });

    it("should match the schema of daily tip", async () => {
      const response = await request(app).get("/daily-tip");

      const parsedResult = dailyTipSchema.safeParse(response.body.data);

      expect(parsedResult.success).toBe(true);
    });
  });
});
