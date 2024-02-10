import express from "express";
import { prisma } from "../lib/prisma";

export const postsRouter = express.Router();

postsRouter.get("/", async (req, res) => {
  const posts = await prisma.post.findMany({});

  res.send(posts);
});

postsRouter.post(`/`, async (req, res) => {
  const { title, content } = req.body;

  const newPost = await prisma.post.create({ data: { title, content } });

  res.json(newPost);
});

postsRouter.get(`/:id`, async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({ where: { id: Number(id) } });

  if (!post) {
    return res.status(404).send();
  }

  res.json(post);
});

postsRouter.delete(`/:id`, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await prisma.post.delete({ where: { id: Number(id) } });

    res.json(deletedPost);
  } catch (error) {
    res.status(404).send();
  }
});
