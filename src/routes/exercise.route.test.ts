import { Exercise as ServerExerciseType } from "@prisma/client";
import { beforeEach } from "node:test";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../app";
import prisma from "../database/__mocks__/prisma";
import { exerciseSchema } from "../types/exercise.type";
import { exercises as placeholderExercise } from "../lib/placeholder-data";

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
  });
});
