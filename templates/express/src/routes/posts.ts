import express from "express";

export const postsRouter = express.Router();

interface Post {
  id: number;
  title: string;
  content: string;
}

const posts: Post[] = [
  {
    id: 1,
    title: "Post 1",
    content: "Test content 1.",
  },
  {
    id: 2,
    title: "Post 2",
    content: "Test content 2.",
  },
  {
    id: 3,
    title: "Post 3",
    content: "Test content 3.",
  },
];

postsRouter.get("/", (req, res) => {
  res.send(posts);
});

postsRouter.post(`/`, (req, res) => {
  const { title, content } = req.body;

  const newPost: Post = { id: posts[posts.length - 1].id + 1, title, content };

  posts.push(newPost);

  res.json(newPost);
});

postsRouter.get(`/:id`, (req, res) => {
  const { id } = req.params;

  const post = posts.find((post) => post.id === Number(id));

  if (!post) {
    return res.status(404).send();
  }

  res.json(post);
});

postsRouter.delete(`/:id`, (req, res) => {
  const { id } = req.params;

  const postIndex = posts.findIndex((post) => post.id === Number(id));

  if (postIndex === -1) {
    return res.status(404).send();
  }

  const removedPosts = posts.splice(postIndex, 1);

  res.json(removedPosts[0]);
});
