import Express, { NextFunction, Request, Response, Router } from "express";

import path from "path";
import { ResponseType } from "../types/response.type";
import { fstat, writeFileSync } from "fs";

const router = Router();

type ResetPasswordResponseType = Response<ResponseType<unknown>>;
const validateToken = (
  req: Request,
  res: ResetPasswordResponseType,
  next: NextFunction
) => {
  const token = req.query.token;
  if (!token && typeof token !== "string") {
    return res.status(400).json({ message: "error", error: "Missing token" });
  }

  console.log({ token });

  next();
};

router.get("/", validateToken, (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "/public/reset-password/index.html"));
});

export default router;
