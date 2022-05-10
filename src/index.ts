import "reflect-metadata";
import connectDB from "./config/config"
import initServer from "./server";

connectDB();
initServer();
