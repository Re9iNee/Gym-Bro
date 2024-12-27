import { Prisma } from "@prisma/client";
import { Request, Router } from "express";
import { z } from "zod";
import prisma from "../database/prisma";
import { generateToken } from "../lib/utils/app.utils";
import { emailService } from "../services/email.service";

const router = Router();

router.post("/", async (req: Request, res) => {
  try {
    const request = await req.body;
    const emailSchema = z.string().email();
    const email = emailSchema.parse(request.email);

    //   check if email exists in the database
    await prisma.user.findUniqueOrThrow({ where: { email } });

    //   create a token
    const token = generateToken();

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour in milliseconds
      },
    });

    await emailService.sendResetPasswordEmail({
      token,
      to: request.email,
    });

    res.status(200);
    return res.json({ message: "Email sent", data: null });
  } catch (e) {
    console.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        res.status(404);
        return res.json({ message: "error", error: "User not found" });
      }
    }
  }
});

export default router;
