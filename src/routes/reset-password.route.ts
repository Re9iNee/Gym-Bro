import { NextFunction, Request, Response, Router } from "express";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import path from "path";
import prisma from "../database/prisma";
import { ResponseType } from "../types/response.type";

const router = Router();

type validateResetPasswordResponse = Response<ResponseType<unknown>>;
async function validateResetPasswordToken(
  req: Request,
  res: validateResetPasswordResponse,
  next: NextFunction
) {
  const token = req.query.token as string;

  if (!token) {
    return res.status(400).json({ message: "error", error: "Missing token" });
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { resetToken: token },
    });

    if (user.resetTokenExpiry! < new Date()) {
      return res.status(401).json({ message: "error", error: "Expired token" });
    }

    // token is valid
    return next();
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res
          .status(401)
          .json({ message: "error", error: "Invalid token" });
      }
    }

    return res.status(500).json({ message: "error", error: "Forbidden" });
  }
}

router.get("/", validateResetPasswordToken, (_, res) => {
  res.sendFile(path.join(__dirname, "../public/reset-password/index.html"));
});

export default router;
