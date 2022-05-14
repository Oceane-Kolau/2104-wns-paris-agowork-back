import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { getToken, Payload, verifyToken } from "../utilitaire/security";
import { connectDBTEST } from "./test.db.config";
import AdminResolver from "../resolvers/userResolver/admin.resolver";
import UserResolver from "../resolvers/userResolver/user.resolver";
import { authenticationChecker } from "../utilitaire/authChecker";
require("dotenv").config();

const token = getToken({
  email: "test@gmail.com",
  role: "ADMIN",
  campus: "Paris",
  firstname: "FirstnameTest1",
  lastname: "LastnameTest1",
});
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
      const req = token;
      return verifyToken(req);
    },
  });

  await server.listen();

  return server;
}
