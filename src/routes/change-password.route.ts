import { Router } from "express";
import validateToken from "../middleware/validate-token.middleware";
import prisma from "../database/prisma";

const router = Router();

router.post("/", validateToken, async (req, res) => {
  const token = req.query.token as string;
  const request = await req.body;
  const password = request.password;

  await prisma.user.update({
    where: { resetToken: token },
    data: { resetToken: null, resetTokenExpiry: null, password },
  });

  res.status(200);
  return res.json({ message: "OK", data: null });
});

export default router;
