import Router from "@koa/router";
import { prisma } from "../lib/prisma";

export const postsRouter = new Router({ prefix: "/posts" });

postsRouter.get("/", async (ctx) => {
  const posts = await prisma.post.findMany({});

  ctx.body = posts;
});

postsRouter.post(`/`, async (ctx) => {
  const { title, content } = ctx.request.body;

  const newPost = await prisma.post.create({ data: { title, content } });

  ctx.body = newPost;
});

postsRouter.get(`/:id`, async (ctx) => {
  const { id } = ctx.params;

  const post = await prisma.post.findUnique({ where: { id: Number(id) } });

  if (!post) {
    ctx.status = 404;
    return;
  }

  ctx.body = post;
});

postsRouter.delete(`/:id`, async (ctx) => {
  const { id } = ctx.params;

  try {
    const deletedPost = await prisma.post.delete({ where: { id: Number(id) } });

    ctx.body = deletedPost;
  } catch (error) {
    ctx.status = 404;
    return;
  }
});
