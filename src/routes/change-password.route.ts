import { Router } from "express";
import validateToken from "../middleware/validate-token.middleware";

const router = Router();

router.post("/", validateToken, async (req, res) => {
  res.status(200);
  return res.json({ message: "OK", data: null });
});

export default router;
