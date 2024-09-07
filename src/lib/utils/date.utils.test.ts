import { describe, expect, it } from "vitest";
import { formatDate } from "./date.utils";

describe("Date Utils", () => {
  it("should return YYYY-MM-DD format", () => {
    const date = new Date("2021-01-01");

    const result = formatDate(date);

    expect(result).toBe("2021-01-01");
  });
});
