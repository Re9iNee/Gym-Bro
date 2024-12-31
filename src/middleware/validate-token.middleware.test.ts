import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request } from "express";
import { describe, expect, it, vi } from "vitest";
import prisma from "../database/__mocks__/prisma";
import { users } from "../lib/placeholder-data";
import validateToken, {
  validateTokenResponse,
} from "./validate-token.middleware";

vi.mock("../database/prisma");

describe("Validate Token Middleware", () => {
  it("should check for token existence in query object", async () => {
    const { next, response } = setupTest();
    const request: Request = { query: {} } as Request;

    // Act
    await validateToken(request, response, next);

    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: "Missing token",
      message: "error",
    });
    expect(next).not.toHaveBeenCalled();
  });
  it("should check for token in the database", async () => {
    // Arrange
    const { next, response } = setupTest();
    const error = new PrismaClientKnownRequestError(
      "NotFoundError: No Token found",
      {
        code: "P2025",
        meta: undefined,
        clientVersion: "5.19.1",
      }
    );
    const request: Request = {
      query: { token: "invalid-token" },
    } as unknown as Request;
    prisma.user.findUniqueOrThrow.mockRejectedValueOnce(error);

    await validateToken(request, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      error: "Invalid token",
      message: "error",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should check for token expiry", async () => {
    // Arrange
    const { next, response } = setupTest();
    const request: Request = {
      query: { token: "expired-token" },
    } as unknown as Request;
    prisma.user.findUniqueOrThrow.mockResolvedValueOnce({
      ...users[0],
      resetToken: "expired-token",
      resetTokenExpiry: new Date(Date.now() - 1000 * 60 * 60),
    });

    // Act
    await validateToken(request, response, next);

    // Assert
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      error: "Expired token",
      message: "error",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if token is valid", async () => {
    // Arrange
    const { next, response } = setupTest();
    const request: Request = {
      query: { token: "valid-token" },
    } as unknown as Request;
    prisma.user.findUniqueOrThrow.mockResolvedValueOnce({
      ...users[0],
      resetToken: "valid-token",
      resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 60),
    });

    // Act
    await validateToken(request, response, next);

    // Assert
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
function setupTest() {
  const response = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as validateTokenResponse;
  const next = vi.fn();

  return { next, response };
}
