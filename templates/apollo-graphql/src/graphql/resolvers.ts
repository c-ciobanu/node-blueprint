import { Resolvers, Post } from "./types.generated";

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

export const resolvers: Resolvers = {
  Query: {
    hello: () => "Hello World!",
    posts: () => posts,
    post: (_parent, args) => {
      const { id } = args;

      const post = posts.find((post) => post.id === Number(id));

      if (!post) {
        return null;
      }

      return post;
    },
  },
  Mutation: {
    addPost: (_parent, args) => {
      const { title, content } = args.input;

      const newPost: Post = {
        id: posts[posts.length - 1].id + 1,
        title,
        content,
      };

      posts.push(newPost);

      return newPost;
    },
    deletePost: (_parent, args) => {
      const { id } = args;

      const postIndex = posts.findIndex((post) => post.id === Number(id));

      if (postIndex === -1) {
        return null;
      }

      const removedPost = posts.splice(postIndex, 1);

      return removedPost[0];
    },
  },
};
