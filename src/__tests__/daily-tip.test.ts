import request from "supertest";
import app from "../app";
import { dailyTip } from "../routes/daily-tip";
import { dailyTipSchema } from "../types/daily-tip.type";

describe("/daily-tip Route", () => {
  describe("GET /daily-tip", () => {
    it("should return daily tip of the day", async () => {
      const response = await request(app).get("/daily-tip");

      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body).toMatchObject({ ...dailyTip });
    });

    it("should match the schema of daily tip", async () => {
      const response = await request(app).get("/daily-tip");

      const parsedResult = dailyTipSchema.safeParse(response.body);
      expect(parsedResult.success).toBe(true);
    });
  });
});
