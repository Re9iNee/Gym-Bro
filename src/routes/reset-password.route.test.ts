import { describe, it, expect, vi } from "vitest";
import supertest from "supertest";
import app from "../app";
import prisma from "../database/__mocks__/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { users } from "../lib/placeholder-data";

vi.mock("../database/prisma");

describe("Static File Routes", () => {
  const request = supertest(app);

  it("should serve the index.html file for /reset-password with valid token", async () => {
    prisma.user.findUniqueOrThrow.mockResolvedValueOnce({
      ...users[0],
      resetToken: "valid-token",
      resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 60),
    });
    const response = await request
      .get("/reset-password/")
      .query({ token: "something" });

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.text).toContain("<!DOCTYPE html>"); // Check for HTML content
  });

  it("should return 400 for missing token", async () => {
    const response = await request.get("/reset-password");

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      message: "error",
      error: "Missing token",
    });
  });

  it("should return 401 for invalid token", async () => {
    // Arrange
    const error = new PrismaClientKnownRequestError(
      "NotFoundError: No Token found",
      {
        code: "P2025",
        meta: undefined,
        clientVersion: "5.19.1",
      }
    );
    prisma.user.findUniqueOrThrow.mockRejectedValueOnce(error);

    // Act
    const response = await request
      .get("/reset-password")
      .query({ token: "invalid" });

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "error",
      error: "Invalid token",
    });
  });

  it("should return 401 for expired token", async () => {
    prisma.user.findUniqueOrThrow.mockResolvedValueOnce({
      ...users[0],
      resetToken: "expired-token",
      resetTokenExpiry: new Date(Date.now() - 1000 * 60 * 60),
    });

    const response = await request
      .get("/reset-password")
      .query({ token: "expired-token" });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      message: "error",
      error: "Expired token",
    });
  });

  it("should return 404 for non-existent files", async () => {
    const response = await request.get("/non-existent-file.html");
    expect(response.status).toBe(404);
  });
});
