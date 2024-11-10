import express, { Request, Response } from "express";
import dailyTipRouter from "./routes/daily-tip.route";

const app = express();
app.get("/", (req: Request, res: Response) => {
  res.send("Gym Bro API");
});

app.use("/daily-tip", dailyTipRouter);

export default app;
