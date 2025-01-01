import { Router } from "express";
import validateToken from "../middleware/validate-token.middleware";
import prisma from "../database/prisma";
import { hashPassword } from "../lib/utils/app.utils";

const router = Router();

router.post("/", validateToken, async (req, res) => {
  const token = req.query.token as string;
  const request = await req.body;
  const password = request.password;

  const hash = await hashPassword(password);

  await prisma.user.update({
    where: { resetToken: token },
    data: { resetToken: null, resetTokenExpiry: null, password: hash },
  });

  res.status(200);
  return res.json({ message: "OK", data: null });
});

export default router;
