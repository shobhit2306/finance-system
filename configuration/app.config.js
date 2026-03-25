import { existsSync } from "fs";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
dotenv.config();

if (!existsSync(".env")) {
  throw new Error("Env not found");
}  
const defaultConfig = {
  environment: String(process.env.ENV),
  serverPort: Number(process.env.PORT),
  databaseUri: String(process.env.DB_URI),
  databaseName: String(process.env.DB_NAME),
  jwtExpiry: Number(process.env.JWT_EXPIRY),
  jwtIss: "AppSq",
  jwtSecret: "Appsquadz",
  appTimezone: "UTC", 
 
}

// const adminData={
//   name: "admin",
//   phoneNo: "1111111111",
//   email:"admin@gmail.com",
//   password:await bcrypt.hash("Admin@123", await bcrypt.genSalt(10)),
//   role:"admin",
//   status:"active"
// }
// const client = new MongoClient(defaultConfig.databaseUri);
// await client.connect();
// await client
//   .db(defaultConfig.databaseName)
//   .collection("user")
//   .updateOne({ role:"admin" }, { $set: adminData }, { upsert: true });
// await client.close();
export default defaultConfig;
