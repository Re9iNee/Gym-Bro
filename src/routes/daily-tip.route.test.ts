import request from "supertest";
import app from "../app";

import { describe, expect, it } from "vitest";
import { dailyTips } from "../lib/placeholder-data";
import { dailyTipSchema } from "../types/daily-tip.type";

describe("/daily-tip Routes", () => {
  describe("GET /daily-tip", () => {
    it("should return daily tip of the day", async () => {
      const response = await request(app).get("/daily-tip");

      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body).toMatchObject({ ...dailyTips[0] });
    });

    it("should match the schema of daily tip", async () => {
      const response = await request(app).get("/daily-tip");

      const parsedResult = dailyTipSchema.safeParse(response.body);

      expect(parsedResult.success).toBe(true);
    });
  });
});
