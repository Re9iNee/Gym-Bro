import { Prisma } from "@prisma/client";
import requestFn from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../app";
import prisma from "../database/__mocks__/prisma";
import { users } from "../lib/placeholder-data";
import * as utils from "../lib/utils/app.utils";
import { emailService } from "../services/email.service";

vi.mock("../database/prisma");

const validUser = users[0];

describe("Forget Password Route", () => {
  describe("Success", () => {
    const request = {
      email: "john.doe@example.com",
    };
    beforeEach(() => {
      vi.restoreAllMocks();

      prisma.user.findUniqueOrThrow.mockResolvedValueOnce(validUser);
      prisma.user.update.mockResolvedValue(validUser);
      vi.spyOn(emailService, "sendResetPasswordEmail").mockResolvedValueOnce({
        emailId: "1",
      });
    });

    it("should send an email to the user with a link to reset the password", async () => {
      const response = await requestFn(app)
        .post("/forget-password")
        .send(request);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Email sent", data: null });
    });

    it("should check if email exists in the database", async () => {
      await requestFn(app).post("/forget-password").send(request);

      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { email: request.email },
      });
    });

    it("should create a token", async () => {
      const generateToken = vi.spyOn(utils, "generateToken");

      await requestFn(app).post("/forget-password").send(request);

      expect(generateToken).toHaveBeenCalledOnce();
    });

    it("should store the hashed token in the database for the same user", async () => {
      // Arrange
      const tokenMock = Buffer.from("a".repeat(32)).toString("hex");
      vi.spyOn(utils, "generateToken").mockReturnValueOnce(tokenMock);

      // Act
      await requestFn(app).post("/forget-password").send(request);

      // Assert
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: request.email },
        data: {
          resetToken: tokenMock,
          resetTokenExpiry: expect.any(Date),
        },
      });
    });

    it("should call the email service to send an email", async () => {
      // Arrange
      const tokenMock = Buffer.from("a".repeat(32)).toString("hex");
      vi.spyOn(utils, "generateToken").mockReturnValueOnce(tokenMock);
      const sendEmail = vi.spyOn(emailService, "sendResetPasswordEmail");

      // Act
      await requestFn(app).post("/forget-password").send(request);

      // Assert
      expect(sendEmail).toHaveBeenCalledOnce();
      expect(sendEmail).toHaveBeenCalledWith({
        token: tokenMock,
        to: request.email,
      });
    });
  });

  it("should throw an error if email does not exist in the database", async () => {
    const error = new Prisma.PrismaClientKnownRequestError("NotFoundError", {
      code: "P2025",
      clientVersion: "5.19.1",
    });
    const request = {
      email: "wrong@email.com",
    };
    prisma.user.findUniqueOrThrow.mockRejectedValueOnce(error);

    const response = await requestFn(app)
      .post("/forget-password")
      .send(request);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "error",
      error: "User not found",
    });
  });
});

// SEND EMAIL
// user exists
// create a token
// store the hashed token in the database
// token expires in 1 hour
// send an email to the user with a link to reset the password (token included in the link)

// RESET PASSWORD
// user clicks the link (token included in the link)
// check if token is valid
// check if token is expired
// update the user's password
// delete the token from the database
