import express, { Request, Response } from "express";
const bodyParser = require("body-parser");

import changePasswordRouter from "./routes/change-password.route";
import dailyTipRouter from "./routes/daily-tip.route";
import difficultyRouter from "./routes/difficulty.route";
import enumsRouter from "./routes/enums.route";
import equipmentRouter from "./routes/equipment.route";
import exerciseRouter from "./routes/exercise.route";
import forgetPasswordRouter from "./routes/forget-password.route";
import loginRouter from "./routes/login.route";
import muscleRouter from "./routes/muscle.route";
import registerRouter from "./routes/register.route";
import resetPasswordRouter from "./routes/reset-password.route";
import routineRouter from "./routes/routine.route";

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
app.use("/reset-password/", resetPasswordRouter);
app.use("/change-password", changePasswordRouter);
app.use("/equipment", equipmentRouter);
app.use("/enums", enumsRouter);
app.use("/routine", routineRouter);

export default app;
