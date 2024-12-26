import express, { Request, Response } from "express";
const bodyParser = require("body-parser");

import dailyTipRouter from "./routes/daily-tip.route";
import difficultyRouter from "./routes/difficulty.route";
import exerciseRouter from "./routes/exercise.route";
import muscleRouter from "./routes/muscle.route";
import registerRouter from "./routes/register.route";
import loginRouter from "./routes/login.route";
import forgetPasswordRouter from "./routes/forget-password.route";

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

export default app;
