import "dotenv/config";
import { Resend } from "resend";
import { CLIENT_URL } from "../lib/constants";

type ResetPasswordEmailParams = {
  token: string;
  to: string;
  resend?: Resend;
};

type SuccessResponse = {
  emailId: string;
};
type ErrorResponse = {
  error?: unknown;
  message?: string;
};
type ResetPasswordResponse = Promise<SuccessResponse | ErrorResponse>;
async function sendResetPasswordEmail({
  to,
  token,
  resend,
}: ResetPasswordEmailParams): ResetPasswordResponse {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  try {
    const response = await resend.emails.send({
      to,
      from: "support@mora-ed.com",
      subject: "HERE IS YOUR PASSWORD RESET LINK BRO 🗿",
      text: `Here is your password reset link: ${CLIENT_URL}/reset-password?token=${token}`,
    });

    if (!response.data) {
      throw new Error("Failed to send email");
    }

    return {
      emailId: response.data?.id,
    };
  } catch (e) {
    console.error(e);
    return {
      error: e,
      message: "Failed to send email",
    };
  }
}

export const emailService = {
  sendResetPasswordEmail,
};
