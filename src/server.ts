import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { authenticationChecker } from "./utilitaire/authChecker";
import { Payload, verifyToken } from "./utilitaire/security";
require("dotenv").config();

export default async function initServer(): Promise<void> {
  try {
    const server = new ApolloServer({
      cors: true,
      schema: await buildSchema({
        resolvers: [`${__dirname}/resolvers/**/*.{ts,js}`],
        validate: false,
        authChecker: authenticationChecker,
      }),
      context: ({ req }): Payload => {
        const token = req?.headers.authorization;
        if (token) {
          try {
            return verifyToken(token);
          } catch (err) {
            return {};
          }
        }
        return {};
      },
    });

    const { url } = await server.listen(4000);
    // eslint-disable-next-line no-console
    console.log(`🚀 Server ready at ${url}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}
