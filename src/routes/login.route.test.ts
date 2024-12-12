import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import requestFn from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../app";
import prisma from "../database/__mocks__/prisma";
import { users } from "../lib/placeholder-data";

vi.mock("../database/prisma");

const validUser = users[0];

describe("Login Route", () => {
  describe("Success", () => {
    beforeEach(async () => {
      vi.restoreAllMocks();
      prisma.user.findUniqueOrThrow.mockResolvedValueOnce(validUser);
    });
    it("should return 200", async () => {
      const request = {
        username: validUser.username,
        password: "testPassword",
        email: validUser.email,
      };
      // ACT
      const response = await requestFn(app).post("/login").send(request);

      //   Assert
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        message: "OK",
        data: {
          id: 1,
          email: validUser.email,
          username: validUser.username,
        },
      });
    });

    it("should call prisma findUnique", async () => {
      const request = {
        username: validUser.username,
        password: "testPassword",
        email: validUser.email,
      };

      // ACT
      await requestFn(app).post("/login").send(request);

      // Assert
      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { username: request.username, email: request.email },
      });
    });
  });

  describe("Failure", () => {
    it("should return 404 if user is not found", async () => {
      // Arrange
      const error = new PrismaClientKnownRequestError(
        "NotFoundError: No User found",
        {
          code: "P2025",
          meta: undefined,
          clientVersion: "5.19.1",
        }
      );
      prisma.user.findUniqueOrThrow.mockRejectedValueOnce(error);
      const request = {
        username: "nonexistent",
        password: "testPassword",
        email: "non@exist.com",
      };

      //   Act
      const response = await requestFn(app).post("/login").send(request);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        message: "error",
        error: "User not found.",
      });
    });
    it.todo("should return 401 if password is incorrect");
    it.todo("should return 400 if request doesn't have any body");
    it.todo("should get either username or email, but can accept both");
  });
});
