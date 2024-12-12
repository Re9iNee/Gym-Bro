import { Request, Response, Router } from "express";
import prisma from "../database/prisma";
import { ResponseType } from "../types/response.type";
import { Prisma } from "@prisma/client";

const router = Router();

type LoginResponseType = Response<ResponseType<unknown>>;

router.post("/", async (req: Request, res: LoginResponseType) => {
  try {
    const { username: reqUsername, email: reqEmail } = await req.body;

    const user = await prisma.user.findUniqueOrThrow({
      where: { username: reqUsername, email: reqEmail },
    });

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
