import express, { json, urlencoded, static as expressStatic } from "express";
import limiter from "./configuration/ratelimit.config.js";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import connection from "./configuration/database.config.js";
import APPSQUADZ from "./helpers/message.helper.js";
import { createServer } from "http";
import defaultConfig from "./configuration/app.config.js";
import __dirname from "./configuration/dir.config.js";
import { join } from "path";
import superAdminRouter from "./routes/super.admin.route.js";
import organizationRouter from "./routes/organisation.route.js";

const app = express(),
  attachCoreMiddlewares = async () => {
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ limit: "10mb", extended: true }));
    app.use(limiter);
    app.use(expressStatic("public"));
  },
  attachExternalMiddlewares = async () => {
    app.use(cors());
  },
  attachRouters = async () => {
        app.use(APPSQUADZ.ROUTES.ROUTE_SUPER_ADMIN, superAdminRouter);
    app.use(APPSQUADZ.ROUTES.ROUTE_USER, userRouter);
    app.use(APPSQUADZ.ROUTES.ROUTE_ADMIN, adminRouter);
    app.use(APPSQUADZ.ROUTES.ROUTE_ORGANIZATION,organizationRouter)
  },
  upServer = async () => {
    if (connection.readyState == 1) {
      connection.db
        .listCollections()
        .map((collection) =>
          connection.db.command({ dropIndexes: collection.name, index: "*" })
        );
      console.log(APPSQUADZ.MESSAGES.CONNECTION_SUCCESS);
      await listenToServer();
    } else {
      throw new Error(APPSQUADZ.MESSAGES.CONNECTION_STATE_CGE);
    }
  },
  listenToServer = async () => {
    const server = createServer(app);
    console.log(defaultConfig.serverPort, "defaultConfig.serverPort");

    // Set the maximum header size limit
    server.maxHeaderSize = 10 * 1024 * 1024; // 10MB

    server.listen(parseInt(defaultConfig.serverPort));
    server.once("listening", () =>
      console.log(
        APPSQUADZ.MESSAGES.SERVER_STARTED.replace(
          "PORT",
          defaultConfig.serverPort
        ).replace(
          "TIME",
          new Date().toString() + ` ${defaultConfig.appTimezone}`
        )
      )
    );
    server.on("error", (error) => {
      throw error;
    });
  },
  applicationStack = {
    app,
    attachCoreMiddlewares,
    attachExternalMiddlewares,
    attachRouters,
    upServer,
  };

export default applicationStack;
