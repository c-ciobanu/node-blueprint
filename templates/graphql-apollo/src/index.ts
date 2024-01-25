import { readFileSync } from "fs";
import { resolve } from "path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./graphql/resolvers";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const typeDefs = readFileSync(
  resolve(__dirname, "./graphql/schema.graphql"),
  "utf8"
);

const server = new ApolloServer({ typeDefs, resolvers });

async function start() {
  const { url } = await startStandaloneServer(server, { listen: { port } });

  console.info(`Server is running on ${url}`);
}

start();
