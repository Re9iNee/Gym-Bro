import { Router } from "express";

import path from "path";
import validateToken from "../middleware/validate-token.middleware";

const router = Router();

router.get("/", validateToken, (_, res) => {
  res.sendFile(path.join(__dirname, "../public/reset-password/index.html"));
});

export default router;
