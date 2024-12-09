import { Prisma, User } from "@prisma/client";
import { Request, Response, Router } from "express";
import prisma from "../database/prisma";
import { registerSchema, userSchema } from "../types/register.type";
import { ResponseType } from "../types/response.type";
import { hashPassword } from "../lib/utils/app.utils";

const router = Router();

type RegisterResponseType = Response<ResponseType<Partial<User>>>;

router.post("/", async (req: Request, res: RegisterResponseType) => {
  try {
    const body = await req.body;

    const parseResult = registerSchema.safeParse(body);
    if (!parseResult.success) {
      res.status(400);
      return res.json({
        message: "error",
        error: parseResult.error.errors
          .map((e) => `'${e.path}', ${e.message}`)
          .join(", "),
      });
    }

    const { password, ...reqData } = parseResult.data;
    const hash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: reqData.username,
        password: hash,
        email: reqData.email,
      },
    });
    res.status(200);
    return res.json({
      message: "OK",
      data: { username: user.username, id: user.id },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        res.status(409);
        return res.json({
          message: "error",
          error: "Username already exists.",
        });
      }
    }

    res.status(500);
    return res.json({
      message: "error",
      error: e,
    });
  }
});

export default router;
