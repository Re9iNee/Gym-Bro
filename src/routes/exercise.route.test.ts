import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import { Difficulty, Equipment, Focus, Goal, Muscle } from "@prisma/client";
import prisma from "../database/__mocks__/prisma";
import app from "../app";
import { beforeEach } from "node:test";

const exercise = {
  id: 1,
  difficulty: Difficulty.EASY,
  name: "pushups",
  equipment: [],
  focus: [],
  description: "",
  image_url: "",
  video_url: "",
  alternate_names: [""],
  muscles: [],
  tips: [],
  steps: [],
  goal: [],
};

vi.mock("@prisma/client", async (importOriginal: any) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    Difficulty: {
      EASY: "EASY",
    },
  };
});

vi.mock("../database/prisma");

describe("Exercise Route", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  it("should return a list of exercises", async () => {
    prisma.exercise.findMany.mockResolvedValueOnce([exercise]);

    const response = await request(app).get("/exercise");

    const data = await response.body;

    console.log(data);

    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toMatchObject({
      message: "OK",
      data: [exercise],
    });
  });
});
