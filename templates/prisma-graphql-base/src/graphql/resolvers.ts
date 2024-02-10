import { prisma } from "../lib/prisma";
import { Resolvers } from "./types.generated";

export const resolvers: Resolvers = {
  Query: {
    hello: () => "Hello World!",
    posts: async () => {
      const posts = await prisma.post.findMany({});

      return posts;
    },
    post: async (_parent, args) => {
      const { id } = args;

      const post = await prisma.post.findUnique({ where: { id: Number(id) } });

      if (!post) {
        return null;
      }

      return post;
    },
  },
  Mutation: {
    addPost: async (_parent, args) => {
      const { title, content } = args.input;

      const newPost = await prisma.post.create({ data: { title, content } });

      return newPost;
    },
    deletePost: async (_parent, args) => {
      const { id } = args;

      try {
        const deletedPost = await prisma.post.delete({
          where: { id: Number(id) },
        });

        return deletedPost;
      } catch (error) {
        return null;
      }
    },
  },
};
