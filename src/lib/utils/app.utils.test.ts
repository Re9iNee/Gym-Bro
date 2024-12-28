import { compare } from "bcryptjs";
import crypto from "crypto";
import { describe, expect, it, vi } from "vitest";
import { generateToken, hashPassword } from "./app.utils";

describe("App Utils", () => {
  it("should hash the given password", async () => {
    // Arrange
    const plaintextPassword = "password";

    // Act
    const hash = await hashPassword(plaintextPassword);

    // Assert
    expect(await compare(plaintextPassword, hash)).toBe(true);
  });

  vi.mock("crypto", async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...(actual as any),
      randomBytes: vi.fn(),
    };
  });

  describe("should generate token", () => {
    it("should call crypto.randomBytes and return a hex string", () => {
      const mockBuffer = Buffer.from("a".repeat(32));
      crypto.randomBytes = vi.fn(() => mockBuffer);

      const token = generateToken();

      expect(crypto.randomBytes).toHaveBeenCalledWith(32);
      expect(token).toBe(mockBuffer.toString("hex"));
    });
  });
});
