import Router from "@koa/router";

export const postsRouter = new Router({ prefix: "/posts" });

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

postsRouter.get("/", (ctx) => {
  ctx.body = posts;
});

postsRouter.post(`/`, (ctx) => {
  const { title, content } = ctx.request.body;

  const newPost: Post = { id: posts[posts.length - 1].id + 1, title, content };

  posts.push(newPost);

  ctx.body = newPost;
});

postsRouter.get(`/:id`, (ctx) => {
  const { id } = ctx.params;

  const post = posts.find((post) => post.id === Number(id));

  if (!post) {
    ctx.status = 404;
    return;
  }

  ctx.body = post;
});

postsRouter.delete(`/:id`, (ctx) => {
  const { id } = ctx.params;

  const postIndex = posts.findIndex((post) => post.id === Number(id));

  if (postIndex === -1) {
    ctx.status = 404;
    return;
  }

  const removedPosts = posts.splice(postIndex, 1);

  ctx.body = removedPosts[0];
});
