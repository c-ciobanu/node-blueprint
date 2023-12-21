import Router from "@koa/router";

export const indexRouter = new Router();

indexRouter.get("/", function (ctx) {
  ctx.body = "Hello World!";
});
