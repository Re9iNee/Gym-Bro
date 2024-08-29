import express from "express";

const app = express();
app.get("/", (req, res) => {
  res.send("Gym Bro API");
});

export default app;
