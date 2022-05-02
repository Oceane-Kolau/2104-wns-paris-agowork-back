import { connect } from "mongoose";
require("dotenv").config();

export default async function connectDB(): Promise<void> {
  try {
    await connect("mongodb://mongodb:27017/agowork");
    // eslint-disable-next-line no-console
    console.log("Connected to database");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Error during Database Connection : ${err}`);
  }
}
