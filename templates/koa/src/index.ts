import koa from "koa";
import { koaBody } from "koa-body";

import { indexRouter } from "./routes/index";
import { postsRouter } from "./routes/posts";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = new koa();

app.use(koaBody());

app.use(indexRouter.routes());
app.use(postsRouter.routes());

app.listen(port, () => {
  console.log(`[ ready ] http://localhost:${port}`);
});
