import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";
import { hashPassword } from "./app.utils";

describe("App Utils", () => {
  it("should hash the given password", async () => {
    // Arrange
    const plaintextPassword = "password";
    // Act
    const hash = await hashPassword(plaintextPassword);

    // Assert
    expect(await compare(plaintextPassword, hash)).toBe(true);
  });
});
