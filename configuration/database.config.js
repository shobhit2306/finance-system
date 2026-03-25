import mongoose from "mongoose";
import defaultConfig from "./app.config.js";

const { databaseUri } = defaultConfig;

await mongoose.connect(databaseUri, {
  autoCreate: true,
  autoIndex: true,
  socketTimeoutMS: 45000,
  family: 4,
});

export default mongoose.connection;
