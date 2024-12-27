import { CreateEmailResponse, Resend } from "resend";
import { describe, expect, it, vi } from "vitest";
import { emailService } from "./email.service";

vi.mock("resend", () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn(),
      },
    })),
  };
});

const resend = new Resend();

describe("Email Service", () => {
  describe("reset password email", () => {
    it("should call resend function", async () => {
      const resolvedValue: CreateEmailResponse = {
        data: { id: "71cdfe68-cf79-473a-a9d7-21f91db6a526" },
        error: null,
      };
      resend.emails.send = vi.fn().mockResolvedValueOnce(resolvedValue);

      // Act
      const response = await emailService.sendResetPasswordEmail({
        resend,
        to: "a@a.com",
        token: "token",
      });

      // Assert
      expect(resend.emails.send).toHaveBeenCalledOnce();
      expect(response).toMatchObject({
        emailId: "71cdfe68-cf79-473a-a9d7-21f91db6a526",
      });
    });
  });
});
