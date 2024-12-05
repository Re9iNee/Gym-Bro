import { User } from "@prisma/client";
import requestFn from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../app";
import prisma from "../database/__mocks__/prisma";
import { hashPassword } from "../lib/utils/app.utils";

vi.mock("../database/prisma");

vi.mock("../lib/utils/app.utils", () => ({
  hashPassword: vi.fn(() => "mockedPassword"),
}));

describe("Register Route", () => {
  it("should register a new user with username & password", async () => {
    const request = {
      username: "testUser",
      password: "password",
    };
    prisma.user.create.mockResolvedValueOnce({
      id: 2,
      username: request.username,
    } as User);

    const response = await requestFn(app).post("/register").send(request);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: request.username,
        password: "mockedPassword",
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
      username: "testUser",
      password: "password",
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
        prisma.user.create.mockResolvedValueOnce({} as User);
      });
      it("should throw an error on username smaller than 4 characters", async () => {
        const request = {
          username: "ddd",
          password: "validPassword",
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
          username: "thisIsAVeryLongUsername",
          password: "validPassword",
        };

        const response = await requestFn(app).post("/register").send(request);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          message: "error",
          error: "'username', Username must be at most 20 characters.",
        });
      });
    });
  });
});
