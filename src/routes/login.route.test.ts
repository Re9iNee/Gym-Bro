import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import requestFn from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../app";
import prisma from "../database/__mocks__/prisma";
import { users } from "../lib/placeholder-data";

vi.mock("../database/prisma");

const validUser = users[0];
const validPassword = "pa55W0rd";

describe("Login Route", () => {
  describe("Success", () => {
    beforeEach(async () => {
      vi.restoreAllMocks();
      prisma.user.findUniqueOrThrow.mockResolvedValueOnce(validUser);
    });
    it("should return 200", async () => {
      const request = {
        email: validUser.email,
        password: validPassword,
        username: validUser.username,
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
        email: validUser.email,
        password: validPassword,
        username: validUser.username,
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
        email: "non@exist.com",
        username: "nonexistent",
        password: "testPassword",
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

    it("should return 401 if password is incorrect", async () => {
      const request = {
        username: validUser.username,
        password: "wrongPassword",
        email: validUser.email,
      };
      prisma.user.findUniqueOrThrow.mockResolvedValueOnce(validUser);

      // Act
      const response = await requestFn(app).post("/login").send(request);

      // Arrange
      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        message: "error",
        error: "Password is incorrect.",
      });
    });
    it("should return 400 if request doesn't have any body", async () => {
      const response = await requestFn(app).post("/login");

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        message: "error",
        error: "Request body is required.",
      });
    });
    it("should get either username or email, but can accept both", async () => {
      const request = {
        password: validPassword,
      };

      const response = await requestFn(app).post("/login").send(request);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        message: "error",
        error: "'email' or 'username' is required",
      });
    });
  });
});
