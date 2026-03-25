import { Router } from "express";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import roleGuardMiddleware from "../middlewares/roleGuard.middleware.js";
import organisationDomain from "../controller/organisation.controller.js";


const organizationRouter = Router(),
  {
orgSignup,
orgLogin,
sponsorUser
   
  } =organisationDomain;

organizationRouter.post("/signup", orgSignup);
organizationRouter.post("/login", orgLogin);
organizationRouter.post("/sponsor-user",jwtMiddleware.verifyToken,roleGuardMiddleware.authorize(["ORGANIZATION"]),sponsorUser);

export default organizationRouter ;
