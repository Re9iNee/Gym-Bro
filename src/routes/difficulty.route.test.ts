import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../app";

vi.mock("@prisma/client", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    Difficulty: {
      DARK_SOULS: "DARK_SOULS",
      HARD: "HARD",
      MEDIUM: "MEDIUM",
      EASY: "EASY",
    },
  };
});

describe("Difficulty Route", () => {
  it("should return all difficulties", async () => {
    const response = await request(app).get("/difficulty");
    const data = await response.body;

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      data: ["DARK_SOULS", "HARD", "MEDIUM", "EASY"],
      message: "OK",
    });
  });
});
