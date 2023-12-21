import express from "express";

import { indexRouter } from "./routes/index";
import { postsRouter } from "./routes/posts";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`[ ready ] http://localhost:${port}`);
});
