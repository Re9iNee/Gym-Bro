import { Equipment } from "@prisma/client";
import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app";

describe("Equipment Route", () => {
  it("should return list of all equipments", async () => {
    // Arrange
    const equipmentsListLength = Object.keys(Equipment).length;

    // Act
    const result = await request(app).get("/equipment");

    // Assert
    expect(result.status).toBe(200);
    expect(result.type).toBe("application/json");
    expect(result.body.data).toHaveLength(equipmentsListLength);
  });
});
