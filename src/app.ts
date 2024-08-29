import express from "express";
import dailyTipRouter from "./routes/daily-tip";

const app = express();
app.get("/", (req, res) => {
  res.send("Gym Bro API");
});

app.use("/daily-tip", dailyTipRouter);

export default app;
