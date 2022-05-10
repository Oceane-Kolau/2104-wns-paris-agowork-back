import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { Payload, verifyToken } from "../utilitaire/security";
import { connectDBTEST } from "./test.db.config";
import AdminResolver from "../resolvers/userResolver/admin.resolver";
import UserResolver from "../resolvers/userResolver/user.resolver";
import { authenticationChecker } from "../utilitaire/authChecker";
require("dotenv").config();

export async function startServer(): Promise<ApolloServer> {
  await connectDBTEST();
  const schema = await buildSchema({
    resolvers: [AdminResolver, UserResolver],
    validate: false,
    authChecker: authenticationChecker,
  });

  const server: ApolloServer = new ApolloServer({
    schema,
    context: (): Payload => {
      const req =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsMUBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJjYW1wdXMiOiJQYXJpcyIsIm1vb2QiOiLwn4yIIiwiZmlyc3RuYW1lIjoiZmlyc3RuYW1lMSIsImxhc3RuYW1lIjoibGFzdG5hbWUxIiwiaWF0IjoxNjUxNzA3NzAyLCJleHAiOjE2NTIzMTI1MDJ9.9La6qUlBgQjbA-7owzG16Us9pchjbI3idIbak3BvTiw";
      return verifyToken(req);
    },
  });

  await server.listen();

  return server;
}
