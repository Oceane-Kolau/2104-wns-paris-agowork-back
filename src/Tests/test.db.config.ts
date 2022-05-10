/* eslint-disable no-console */
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = new MongoMemoryServer();

export const connectDBTEST = async (): Promise<void> => {
  try {
    const uri = await mongod.getUri();
     await mongoose.connect(uri);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

export const clearDatabase = async (): Promise<void> => {
  const { collections } = mongoose.connection;
  Object.values(collections).forEach(async (collection: any) => {
    await collection.deleteMany({});
  });
};
