import { readFileSync } from "fs";
import { resolve } from "path";
import { createServer } from "http";
import { createYoga, createSchema } from "graphql-yoga";
import { resolvers } from "./graphql/resolvers";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const typeDefs = readFileSync(
  resolve(__dirname, "./graphql/schema.graphql"),
  "utf8"
);

const schema = createSchema({ typeDefs, resolvers });
const yoga = createYoga({ schema });
const server = createServer(yoga);

server.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}/graphql`);
});
