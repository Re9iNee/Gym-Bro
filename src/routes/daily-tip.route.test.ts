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

describe("PATCH /assign-daily-tip", () => {
  it("should assign and return todays daily tip", async () => {
    const selectedDT = mockedDTs[2];

    prisma.$transaction.mockResolvedValue({
      ...selectedDT,
      isActive: true,
      lastShownDate: new Date("2024-09-11"),
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

const rest = {
  summary: "something",
  content: "something",
  image_url: "something",
  video_url: "something",
  references: JSON.stringify([{ title: "something", url: "something.com" }]),
};
const mockedDTs: DailyTip[] = [
  {
    id: 1,
    isActive: false,
    lastShownDate: new Date("2021-01-01"),
    title: "DT1",
    ...rest,
  },
  {
    id: 2,
    isActive: true,
    lastShownDate: new Date("2021-01-01"),
    title: "DT2",
    ...rest,
  },
  {
    id: 3,
    isActive: false,
    lastShownDate: null,
    title: "DT3",
    ...rest,
  },
  {
    id: 4,
    isActive: false,
    lastShownDate: new Date("2021-01-01"),
    title: "DT4",
    ...rest,
  },
  {
    id: 5,
    isActive: false,
    lastShownDate: new Date("2021-01-01"),
    title: "DT5",
    ...rest,
  },
];
