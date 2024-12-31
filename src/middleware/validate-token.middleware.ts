import { NextFunction, Response, Request } from "express";
import { ResponseType } from "../types/response.type";
import prisma from "../database/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export type validateTokenResponse = Response<ResponseType<void>>;

export default async function validateToken(
  req: Request,
  res: validateTokenResponse,
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
