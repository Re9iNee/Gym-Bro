import { Exercise as ServerExerciseType } from "@prisma/client";
import { beforeEach } from "node:test";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../app";
import prisma from "../database/__mocks__/prisma";
import { exerciseSchema } from "../types/exercise.type";
import { exercises as placeholderExercise } from "../lib/placeholder-data";
import { objectContainsKey } from "vitest-mock-extended";

const exerciseMock = placeholderExercise[0];

vi.mock("../database/prisma");

describe("Exercise Route", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  describe("GET /exercise", () => {
    it("should return a list of exercises", async () => {
      prisma.exercise.findMany.mockResolvedValueOnce([exerciseMock]);

      const response = await request(app).get("/exercise");

      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body).toMatchObject({
        message: "OK",
        data: [exerciseMock],
      });
    });

    it("should match the schema of exercise", async () => {
      prisma.exercise.findMany.mockResolvedValueOnce([exerciseMock]);
      const response = await request(app).get("/exercise");

      const data = await response.body;

      const parsedResult = exerciseSchema.safeParse(data.data?.[0]);

      expect(parsedResult.success).toBe(true);
    });

    it("should return empty array if no exercises found", async () => {
      prisma.exercise.findMany.mockResolvedValueOnce([]);

      const response = await request(app).get("/exercise");

      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body).toMatchObject({
        message: "OK",
        data: [],
      });
    });

    it("should return single exercise if id provided", async () => {
      prisma.exercise.findUnique.mockResolvedValueOnce(exerciseMock);

      const response = await request(app).get(`/exercise/${exerciseMock.id}`);

      expect(prisma.exercise.findUnique).toHaveBeenCalledWith({
        where: { id: exerciseMock.id },
      });
      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body).toMatchObject({
        message: "OK",
        data: exerciseMock,
      });
    });

    it("should be to searchable by name", async () => {
      // ARRANGE
      prisma.exercise.findMany.mockResolvedValueOnce([exerciseMock]);

      // ACT
      await request(app).get("/exercise?name=exercise");

      // ASSERT
      expect(prisma.exercise.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          name: {
            contains: "exercise",
            mode: "insensitive",
          },
        }),
      });
    });

    it("should be searchable by goals", async () => {
      // ARRANGE
      prisma.exercise.findMany.mockResolvedValueOnce([exerciseMock]);

      // ACT
      await request(app).get("/exercise?goals=WEIGHT_LOSS");

      // ASSERT
      expect(prisma.exercise.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          goals: {
            has: "WEIGHT_LOSS",
          },
        }),
      });
    });

    it("should throw proper error if goal is not a valid goal", async () => {
      // ARRANGE
      prisma.exercise.findMany.mockResolvedValueOnce([exerciseMock]);

      // ACT
      const response = await request(app).get("/exercise?goals=INVALID_GOAL");

      // ASSERT
      expect(response.status).toBe(406);
      expect(response.body).toMatchObject({
        message: "error",
        error:
          "Not Acceptable, Invalid goal provided, please provide a valid goal",
      });
    });
  });
});
