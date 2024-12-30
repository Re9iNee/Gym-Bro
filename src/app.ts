import express, { Request, Response } from "express";
const bodyParser = require("body-parser");

import dailyTipRouter from "./routes/daily-tip.route";
import difficultyRouter from "./routes/difficulty.route";
import exerciseRouter from "./routes/exercise.route";
import muscleRouter from "./routes/muscle.route";
import registerRouter from "./routes/register.route";
import loginRouter from "./routes/login.route";
import forgetPasswordRouter from "./routes/forget-password.route";
import resetPasswordRouter from "./routes/reset-password.route";
import path from "path";
import prisma from "./database/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import exp from "constants";

const app = express();
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Gym Bro API");
});

app.use("/daily-tip", dailyTipRouter);
app.use("/difficulty", difficultyRouter);
app.use("/exercise", exerciseRouter);
app.use("/muscle", muscleRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/forget-password", forgetPasswordRouter);
// app.use("/reset-password/", resetPasswordRouter);

// app.use("/public", express.static(path.join(__dirname, "public")));

async function validateResetPasswordToken(req: any, res: any, next: any) {
  const token = req.query.token;

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
    console.error(e);
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res
          .status(401)
          .json({ message: "error", error: "Invalid token" });
      }
    }

    return res.status(403).send("Invalid token.");
  }
}

// Route to serve the reset-password HTML file
app.get("/reset-password", validateResetPasswordToken, (req, res) => {
  res.sendFile(path.join(__dirname, "public/reset-password/index.html"));
});

// Middleware to serve static files (e.g., your HTML files)
// app.use("/public", express.static(path.join(__dirname, "public")));

export default app;
