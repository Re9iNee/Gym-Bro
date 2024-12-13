import { Prisma } from "@prisma/client";
import { compare } from "bcryptjs";
import { Request, Response, Router } from "express";
import prisma from "../database/prisma";
import { ResponseType } from "../types/response.type";

const router = Router();

type LoginResponseType = Response<ResponseType<unknown>>;

router.post("/", async (req: Request, res: LoginResponseType) => {
  try {
    const body = await req.body;
    if (!body || Object.keys(body).length === 0) {
      res.status(400);
      return res.json({
        message: "error",
        error: "Request body is required.",
      });
    }
    const { username: reqUsername, email: reqEmail, password } = body;

    const user = await prisma.user.findUniqueOrThrow({
      where: { username: reqUsername, email: reqEmail },
    });

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401);
      return res.json({ message: "error", error: "Password is incorrect." });
    }

    res.status(200);
    return res.json({
      message: "OK",
      data: user,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        res.status(404);
        return res.json({ message: "error", error: "User not found." });
      }
    }
  }
});

export default router;
