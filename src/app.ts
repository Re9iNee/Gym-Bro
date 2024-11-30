import express, { Request, Response } from "express";
import dailyTipRouter from "./routes/daily-tip.route";
import difficultyRouter from "./routes/difficulty.route";
import exerciseRouter from "./routes/exercise.route";
import muscleRouter from "./routes/muscle.route";

const app = express();
app.get("/", (req: Request, res: Response) => {
  res.send("Gym Bro API");
});

app.use("/daily-tip", dailyTipRouter);
app.use("/difficulty", difficultyRouter);
app.use("/exercise", exerciseRouter);
app.use("/muscle", muscleRouter);

export default app;
