import supertest from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../app";
import prisma from "../database/__mocks__/prisma";
import { users } from "../lib/placeholder-data";
import validateToken from "../middleware/validate-token.middleware";

vi.mock("../database/prisma");

vi.mock("../middleware/validate-token.middleware", () => {
  return {
    default: vi.fn((req, res, next) => next()),
  };
});

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

  it("should check call validate token middleware", async () => {
    await request.get("/reset-password/").query({ token: "something" });

    expect(validateToken).toHaveBeenCalled();
  });

  it("should return 404 for non-existent files", async () => {
    const response = await request.get("/non-existent-file.html");
    expect(response.status).toBe(404);
  });
});
