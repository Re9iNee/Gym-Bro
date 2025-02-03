import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../app";
import prisma from "../database/__mocks__/prisma";
import { routines } from "../lib/placeholder-data";
import { Prisma } from "@prisma/client";

type RoutineWithAllFields = Prisma.RoutineGetPayload<{
  include: {
    users: true;
    days: { include: { exercises: true } };
  };
}>;

vi.mock("../database/prisma");

const fetch = request(app);
describe("Routine Route", () => {
  it("should return user's today routine", async () => {
    prisma.routine.findMany.mockResolvedValueOnce(routines);

    const response = await fetch.get("/routine").query({
      userId: 22,
      day: "MONDAY",
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ message: "OK", data: routines });

    const data = response.body.data as RoutineWithAllFields[];
    const allDaysAreMonday = data.every((routine) =>
      routine.days.every((day) => day.day === "MONDAY")
    );
    expect(allDaysAreMonday).toBe(true);
  });

  it("should throw error if userId not provided", async () => {
    const response = await fetch.get("/routine").query({ day: "MONDAY" });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: "error",
      error: "userId is required",
    });
  });
  it("should throw error if day not provided", async () => {
    const response = await fetch.get("/routine").query({ userId: 22 });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: "error",
      error: "day is required",
    });
  });
});
