import express from "express";

export const indexRouter = express.Router();

indexRouter.get("/", function (req, res) {
  res.send("Hello World!");
});
