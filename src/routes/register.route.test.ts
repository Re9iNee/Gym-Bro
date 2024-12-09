import { Prisma, User } from "@prisma/client";
import requestFn from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../app";
import prisma from "../database/__mocks__/prisma";
import { hashPassword } from "../lib/utils/app.utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

vi.mock("../database/prisma");

vi.mock("../lib/utils/app.utils", () => ({
  hashPassword: vi.fn(() => "mockedHashPassword"),
}));

describe("Register Route", () => {
  const validPassword = "validPassword$2";
  const invalidPassword = "invalidPassword";
  const invalidUsername = "ddd";
  const validUsername = "testUser";

  it("should register a new user with username & password", async () => {
    const request = {
      username: validUsername,
      password: validPassword,
    };
    prisma.user.create.mockResolvedValueOnce({
      id: 2,
      username: request.username,
    } as User);

    const response = await requestFn(app).post("/register").send(request);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: request.username,
        password: "mockedHashPassword",
      },
    });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: "OK",
      data: {
        id: 2,
        username: request.username,
      },
    });
  });

  it("should call hash password function", async () => {
    // Arrange
    const request = {
      username: validUsername,
      password: validPassword,
    };
    prisma.user.create.mockResolvedValueOnce({} as User);

    // Act
    await requestFn(app).post("/register").send(request);

    // Assert
    expect(hashPassword).toHaveBeenCalledWith(request.password);
  });

  describe("Invalid requests", () => {
    it("should throw on empty request body", async () => {
      // Arrange
      const request = {};
      prisma.user.create.mockResolvedValueOnce({} as User);

      // Act
      const response = await requestFn(app).post("/register").send(request);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        message: "error",
        error: expect.any(String),
      });
    });

    describe("Invalid Username", () => {
      beforeEach(() => {
        vi.restoreAllMocks();
        prisma.user.create.mockResolvedValueOnce({} as User);
      });
      it("should throw an error on username smaller than 4 characters", async () => {
        const request = {
          username: invalidUsername,
          password: validPassword,
        };

        const response = await requestFn(app).post("/register").send(request);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          message: "error",
          error: "'username', Username must be at least 4 characters.",
        });
      });
      it("should throw an error on username larger than 20 characters", async () => {
        const request = {
          username: invalidUsername.repeat(60),
          password: validPassword,
        };

        const response = await requestFn(app).post("/register").send(request);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          message: "error",
          error: "'username', Username must be at most 20 characters.",
        });
      });
    });

    describe("Invalid Password", () => {
      beforeEach(() => {
        vi.restoreAllMocks();
        prisma.user.create.mockResolvedValueOnce({} as User);
      });

      it("should throw an error on invalid password", async () => {
        const request = {
          username: validUsername,
          password: invalidPassword,
        };

        const response = await requestFn(app).post("/register").send(request);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          message: "error",
          error:
            "'password', must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
        });
      });
    });

    describe("Prisma Error", () => {
      beforeEach(() => {
        vi.restoreAllMocks();
      });

      it("should return 500 on prisma error", async () => {
        prisma.user.create.mockRejectedValueOnce(new Error("Prisma Error"));
        const request = {
          username: validUsername,
          password: validPassword,
        };

        const response = await requestFn(app).post("/register").send(request);

        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
          message: "error",
          error: expect.any(Object),
        });
      });

      it("should return 409 on duplicate username", async () => {
        const error = new PrismaClientKnownRequestError(
          "Username already exists.",
          { code: "P2002", clientVersion: "5.19.1" }
        );
        prisma.user.create.mockRejectedValueOnce(error);
        const request = {
          username: validUsername,
          password: validPassword,
        };

        const response = await requestFn(app).post("/register").send(request);

        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
          message: "error",
          error: "Username already exists.",
        });
      });
    });
  });
});
