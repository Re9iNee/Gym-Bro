import { Goal } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { isGoalValid } from "./exercise.controller";

describe("Exercise Controller", () => {
  describe("isGoalValid fn", () => {
    it("should return true if goal is valid", () => {
      // Arrange
      const goal = "STRENGTH";
      // Act
      const result = isGoalValid(goal);
      // Assert
      expect(result).toBe(true);
    });

    it("should return false if goal is invalid", () => {
      // Arrange
      const goal = "INVALID_GOAL";
      // Act
      const result = isGoalValid(goal as Goal);
      // Assert
      expect(result).toBe(false);
    });
  });
});
