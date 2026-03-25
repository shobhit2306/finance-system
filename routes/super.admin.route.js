import { Router } from "express";
import superAdminDomain from "../controller/super-admin.controller.js";
import APPSQUADZ from "../helpers/message.helper.js";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import roleGuardMiddleware from "../middlewares/roleGuard.middleware.js";


const superAdminRouter = Router(),
  {
    createAdmin,
    superAdminLogin
   
  } = superAdminDomain,
  {
    ROUTES: {
      SUPER_ADMIN_ENDPOINTS: {
        CREATE_ADMIN,
        SUPER_ADMIN_LOGIN
      },
    },
  } = APPSQUADZ;

superAdminRouter.post(SUPER_ADMIN_LOGIN, superAdminLogin);

superAdminRouter.post(
  CREATE_ADMIN,
  jwtMiddleware.verifyToken,
  roleGuardMiddleware.authorize(["SUPERADMIN"]), 
  createAdmin
);

export default superAdminRouter ;
