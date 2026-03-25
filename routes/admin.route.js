import { Router } from "express";
import adminDomain from "../controller/admin.controller.js";
import APPSQUADZ from "../helpers/message.helper.js";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import roleGuardMiddleware from "../middlewares/roleGuard.middleware.js";

const adminRouter = Router(),
  {
adminLogin,
createSession
  } = adminDomain,
  {
    ROUTES: {
      ADMIN_ENDPOINTS: {
        ADMIN_LOGIN,
        CREATE_SESSION
      },
    },
  } = APPSQUADZ;


adminRouter.post(ADMIN_LOGIN,adminLogin);
adminRouter.post(
  CREATE_SESSION,
  jwtMiddleware.verifyToken,
  roleGuardMiddleware.authorize(["ADMIN"]),
  createSession
);


export default adminRouter;
