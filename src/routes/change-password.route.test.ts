import requestFn from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../app";
import validateToken from "../middleware/validate-token.middleware";
import prisma from "../database/__mocks__/prisma";

vi.mock("../database/prisma");

vi.mock("../middleware/validate-token.middleware", () => {
  return { default: vi.fn((req, res, next) => next()) };
});

const fetch = requestFn(app);
describe("Change Password Route", () => {
  it("should call validate token middleware", async () => {
    await fetch
      .post("/change-password/")
      .query({ token: "something" })
      .send({ password: "newPassword" });

    expect(validateToken).toHaveBeenCalled();
  });

  it("should update user password", async () => {
    const request = {
      password: "newPassword",
    };
    const response = await fetch
      .post("/change-password/")
      .query({ token: "validToken" })
      .send(request);

    expect(response.body).toMatchObject({
      message: "OK",
      data: null,
    });
    expect(response.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { resetToken: "validToken" },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
        password: "newPassword",
      },
    });
  });
});
