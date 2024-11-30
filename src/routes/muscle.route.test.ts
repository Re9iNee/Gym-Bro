import { Muscle } from "@prisma/client";
import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app";

describe("Muscle Route", () => {
  it("should return list of all muscles", async () => {
    // Arrange
    const musclesListLength = Object.keys(Muscle).length;

    // Act
    const result = await request(app).get("/muscle");

    // Assert
    expect(result.status).toBe(200);
    expect(result.type).toBe("application/json");
    expect(result.body.data).toHaveLength(musclesListLength);
  });
});
